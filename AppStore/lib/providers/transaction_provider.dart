import 'package:flutter/material.dart';
import '../models/transaction.dart';
import '../models/budget.dart';

class TransactionProvider extends ChangeNotifier {
  final List<Transaction> _transactions = [];
  final List<SavingsGoal> _goals = [];
  final List<CategoryBudget> _budgets = [];

  List<Transaction> get transactions => List.unmodifiable(_transactions);
  List<SavingsGoal> get goals => List.unmodifiable(_goals);
  List<CategoryBudget> get budgets => List.unmodifiable(_budgets);

  TransactionProvider() {
    _loadSampleData();
  }

  // --- Computed properties ---

  double get totalIncome => _transactions
      .where((t) => t.type == TransactionType.income)
      .fold(0.0, (sum, t) => sum + t.amount);

  double get totalExpenses => _transactions
      .where((t) => t.type == TransactionType.expense)
      .fold(0.0, (sum, t) => sum + t.amount);

  double get balance => totalIncome - totalExpenses;

  double get safeToSpend {
    final now = DateTime.now();
    final daysInMonth = DateTime(now.year, now.month + 1, 0).day;
    final remainingDays = daysInMonth - now.day + 1;
    final remainingBalance = balance;
    return remainingBalance > 0 ? remainingBalance / remainingDays : 0;
  }

  List<Transaction> get recentTransactions {
    final sorted = List<Transaction>.from(_transactions)
      ..sort((a, b) => b.date.compareTo(a.date));
    return sorted.take(10).toList();
  }

  Map<String, double> get expensesByCategory {
    final map = <String, double>{};
    for (final t in _transactions.where((t) => t.type == TransactionType.expense)) {
      map[t.categoryId] = (map[t.categoryId] ?? 0) + t.amount;
    }
    return map;
  }

  List<Transaction> getTransactionsForMonth(int year, int month) {
    return _transactions.where((t) =>
      t.date.year == year && t.date.month == month
    ).toList();
  }

  double getExpensesForMonth(int year, int month) {
    return getTransactionsForMonth(year, month)
        .where((t) => t.type == TransactionType.expense)
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  double getIncomeForMonth(int year, int month) {
    return getTransactionsForMonth(year, month)
        .where((t) => t.type == TransactionType.income)
        .fold(0.0, (sum, t) => sum + t.amount);
  }

  // --- Mutations ---

  void addTransaction(Transaction transaction) {
    _transactions.add(transaction);
    notifyListeners();
  }

  void removeTransaction(String id) {
    _transactions.removeWhere((t) => t.id == id);
    notifyListeners();
  }

  void addGoal(SavingsGoal goal) {
    _goals.add(goal);
    notifyListeners();
  }

  void addBudget(CategoryBudget budget) {
    _budgets.add(budget);
    notifyListeners();
  }

  // --- Sample Data ---

  void _loadSampleData() {
    final now = DateTime.now();

    _transactions.addAll([
      Transaction(
        amount: 35000, categoryId: 'salary', type: TransactionType.income,
        date: DateTime(now.year, now.month, 1), note: 'Salario mensual',
      ),
      Transaction(
        amount: 5000, categoryId: 'freelance', type: TransactionType.income,
        date: DateTime(now.year, now.month, 5), note: 'Proyecto web',
      ),
      Transaction(
        amount: 2500, categoryId: 'food', type: TransactionType.expense,
        date: DateTime(now.year, now.month, now.day), note: 'Supermercado',
      ),
      Transaction(
        amount: 350, categoryId: 'coffee', type: TransactionType.expense,
        date: DateTime(now.year, now.month, now.day), note: 'Starbucks',
      ),
      Transaction(
        amount: 1200, categoryId: 'transport', type: TransactionType.expense,
        date: DateTime(now.year, now.month, now.day > 1 ? now.day - 1 : 1), note: 'Uber',
      ),
      Transaction(
        amount: 199, categoryId: 'subscriptions', type: TransactionType.expense,
        date: DateTime(now.year, now.month, 3), note: 'Spotify', isRecurring: true,
      ),
      Transaction(
        amount: 299, categoryId: 'subscriptions', type: TransactionType.expense,
        date: DateTime(now.year, now.month, 5), note: 'Netflix', isRecurring: true,
      ),
      Transaction(
        amount: 8500, categoryId: 'home', type: TransactionType.expense,
        date: DateTime(now.year, now.month, 1), note: 'Renta', isRecurring: true,
      ),
      Transaction(
        amount: 800, categoryId: 'gym', type: TransactionType.expense,
        date: DateTime(now.year, now.month, 1), note: 'Membresía gym', isRecurring: true,
      ),
      Transaction(
        amount: 1500, categoryId: 'entertainment', type: TransactionType.expense,
        date: DateTime(now.year, now.month, now.day > 2 ? now.day - 2 : 1), note: 'Cine + cena',
      ),
      Transaction(
        amount: 650, categoryId: 'shopping', type: TransactionType.expense,
        date: DateTime(now.year, now.month, now.day > 3 ? now.day - 3 : 1), note: 'Amazon',
      ),
      Transaction(
        amount: 3200, categoryId: 'food', type: TransactionType.expense,
        date: DateTime(now.year, now.month, 10), note: 'Restaurante italiano',
      ),
      Transaction(
        amount: 450, categoryId: 'health', type: TransactionType.expense,
        date: DateTime(now.year, now.month, 8), note: 'Farmacia',
      ),
    ]);

    _goals.addAll([
      SavingsGoal(
        id: '1', name: 'Viaje a Europa', targetAmount: 45000,
        currentAmount: 18500, emoji: '✈️',
        targetDate: DateTime(now.year + 1, 3, 1),
      ),
      SavingsGoal(
        id: '2', name: 'Fondo de emergencia', targetAmount: 60000,
        currentAmount: 42000, emoji: '🛡️',
      ),
      SavingsGoal(
        id: '3', name: 'MacBook Pro', targetAmount: 35000,
        currentAmount: 8000, emoji: '💻',
      ),
    ]);

    _budgets.addAll([
      CategoryBudget(categoryId: 'food', limit: 6000, spent: 5700),
      CategoryBudget(categoryId: 'transport', limit: 3000, spent: 1200),
      CategoryBudget(categoryId: 'entertainment', limit: 3000, spent: 1500),
      CategoryBudget(categoryId: 'subscriptions', limit: 1500, spent: 498),
      CategoryBudget(categoryId: 'coffee', limit: 1000, spent: 350),
    ]);
  }
}
