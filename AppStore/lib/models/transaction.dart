import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

enum TransactionType { income, expense }

class Category {
  final String id;
  final String name;
  final IconData icon;
  final Color color;

  const Category({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
  });

  static List<Category> defaults = [
    Category(id: 'food', name: 'Comida', icon: Icons.restaurant_rounded, color: const Color(0xFFF59E0B)),
    Category(id: 'transport', name: 'Transporte', icon: Icons.directions_car_rounded, color: const Color(0xFF3B82F6)),
    Category(id: 'entertainment', name: 'Entretenimiento', icon: Icons.movie_rounded, color: const Color(0xFFEC4899)),
    Category(id: 'shopping', name: 'Compras', icon: Icons.shopping_bag_rounded, color: const Color(0xFF8B5CF6)),
    Category(id: 'health', name: 'Salud', icon: Icons.favorite_rounded, color: const Color(0xFFF43F5E)),
    Category(id: 'subscriptions', name: 'Suscripciones', icon: Icons.subscriptions_rounded, color: const Color(0xFF06B6D4)),
    Category(id: 'home', name: 'Hogar', icon: Icons.home_rounded, color: const Color(0xFF10B981)),
    Category(id: 'education', name: 'Educación', icon: Icons.school_rounded, color: const Color(0xFFF97316)),
    Category(id: 'coffee', name: 'Café', icon: Icons.coffee_rounded, color: const Color(0xFF92400E)),
    Category(id: 'gym', name: 'Gym', icon: Icons.fitness_center_rounded, color: const Color(0xFF14B8A6)),
    Category(id: 'salary', name: 'Salario', icon: Icons.account_balance_wallet_rounded, color: const Color(0xFF10B981)),
    Category(id: 'freelance', name: 'Freelance', icon: Icons.laptop_rounded, color: const Color(0xFF7C3AED)),
    Category(id: 'other_income', name: 'Otros ingresos', icon: Icons.attach_money_rounded, color: const Color(0xFF06B6D4)),
    Category(id: 'other', name: 'Otros', icon: Icons.more_horiz_rounded, color: const Color(0xFF64748B)),
  ];

  static List<Category> get expenseCategories =>
      defaults.where((c) => !['salary', 'freelance', 'other_income'].contains(c.id)).toList();

  static List<Category> get incomeCategories =>
      defaults.where((c) => ['salary', 'freelance', 'other_income'].contains(c.id)).toList();
}

class Transaction {
  final String id;
  final double amount;
  final String categoryId;
  final TransactionType type;
  final DateTime date;
  final String? note;
  final bool isRecurring;

  Transaction({
    String? id,
    required this.amount,
    required this.categoryId,
    required this.type,
    DateTime? date,
    this.note,
    this.isRecurring = false,
  })  : id = id ?? const Uuid().v4(),
        date = date ?? DateTime.now();

  Category get category =>
      Category.defaults.firstWhere(
        (c) => c.id == categoryId,
        orElse: () => Category.defaults.last,
      );
}
