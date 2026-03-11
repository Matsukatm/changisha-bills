# Utility functions

def calculate_progress(current: float, target: float) -> float:
    if target == 0:
        return 0
    return (current / target) * 100