from langgraph.graph import StateGraph, END
from models import AssessmentState
from nodes import (
    node_extract_teacher,
    node_extract_student,
    node_evaluate_questions,
    node_compute_similarity,
    node_overall_evaluator,
    node_persist,
    node_handle_error,
)

# Ordered pipeline — each step feeds the next
PIPELINE = [
    ("extract_teacher",    "extract_student"),
    ("extract_student",    "evaluate_questions"),
    ("evaluate_questions", "compute_similarity"),
    ("compute_similarity", "overall_evaluator"),
    ("overall_evaluator",  "persist"),
]


def _route(next_node: str):
    """Returns a router function that either advances or diverts to handle_error."""
    def router(state: AssessmentState) -> str:
        return "handle_error" if state.error else next_node
    router.__name__ = f"route_to_{next_node}"
    return router


def build_graph() -> StateGraph:
    graph = StateGraph(AssessmentState)

    # ── Register nodes ────────────────────────────────────────────────────────
    graph.add_node("extract_teacher",    node_extract_teacher)
    graph.add_node("extract_student",    node_extract_student)
    graph.add_node("evaluate_questions", node_evaluate_questions)
    graph.add_node("compute_similarity", node_compute_similarity)
    graph.add_node("overall_evaluator",  node_overall_evaluator)
    graph.add_node("persist",            node_persist)
    graph.add_node("handle_error",       node_handle_error)

    graph.set_entry_point("extract_teacher")

    # ── Happy path with error short-circuit on every step ────────────────────
    for current, next_node in PIPELINE:
        graph.add_conditional_edges(
            current,
            _route(next_node),
            {next_node: next_node, "handle_error": "handle_error"},
        )

    # persist is the last real node
    graph.add_conditional_edges(
        "persist",
        lambda state: "handle_error" if state.error else END,
        {"handle_error": "handle_error", END: END},
    )

    graph.add_edge("handle_error", END)

    return graph.compile()


assessment_graph = build_graph()