class SavingsGoal {
  final String id;
  final String name;
  final double targetAmount;
  final double currentAmount;
  final String emoji;
  final DateTime? targetDate;

  const SavingsGoal({
    required this.id,
    required this.name,
    required this.targetAmount,
    this.currentAmount = 0,
    this.emoji = '🎯',
    this.targetDate,
  });

  double get progress => targetAmount > 0 ? (currentAmount / targetAmount).clamp(0.0, 1.0) : 0;
  double get remaining => (targetAmount - currentAmount).clamp(0.0, targetAmount);
  bool get isCompleted => currentAmount >= targetAmount;
}

class CategoryBudget {
  final String categoryId;
  final double limit;
  final double spent;

  const CategoryBudget({
    required this.categoryId,
    required this.limit,
    this.spent = 0,
  });

  double get progress => limit > 0 ? (spent / limit).clamp(0.0, 1.5) : 0;
  double get remaining => (limit - spent);
  bool get isOverBudget => spent > limit;
  double get percentUsed => (progress * 100);
}
