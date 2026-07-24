import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/transaction.dart';
import '../providers/transaction_provider.dart';
import '../widgets/glass_card.dart';
import '../widgets/animated_counter.dart';

class BudgetsScreen extends StatelessWidget {
  const BudgetsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<TransactionProvider>(
      builder: (context, provider, _) {
        return CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 60, 20, 8),
                child: Text(
                  'Presupuestos',
                  style: Theme.of(context).textTheme.displayMedium,
                ),
              ),
            ),
            SliverToBoxAdapter(child: _buildGoals(context, provider)),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Límites por categoría', style: Theme.of(context).textTheme.titleMedium),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: GastifyTheme.primaryGradient,
                        borderRadius: BorderRadius.circular(GastifyTheme.radiusFull),
                      ),
                      child: const Text(
                        '+ Agregar',
                        style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  if (index >= provider.budgets.length) return null;
                  final budget = provider.budgets[index];
                  final category = Category.defaults.firstWhere(
                    (c) => c.id == budget.categoryId,
                    orElse: () => Category.defaults.last,
                  );

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                    child: GlassCard(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: category.color.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(GastifyTheme.radiusMd),
                                ),
                                child: Icon(category.icon, color: category.color, size: 22),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(category.name, style: Theme.of(context).textTheme.titleSmall),
                                    const SizedBox(height: 2),
                                    Text(
                                      budget.isOverBudget
                                          ? '¡Excedido por \$${(-budget.remaining).toStringAsFixed(0)}!'
                                          : 'Quedan \$${budget.remaining.toStringAsFixed(0)}',
                                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                        color: budget.isOverBudget
                                            ? GastifyTheme.accentRose
                                            : GastifyTheme.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    '\$${budget.spent.toStringAsFixed(0)}',
                                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                      fontWeight: FontWeight.w700,
                                      color: budget.isOverBudget ? GastifyTheme.accentRose : null,
                                    ),
                                  ),
                                  Text(
                                    'de \$${budget.limit.toStringAsFixed(0)}',
                                    style: Theme.of(context).textTheme.bodySmall,
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: TweenAnimationBuilder<double>(
                              tween: Tween(begin: 0, end: budget.progress.clamp(0.0, 1.0)),
                              duration: const Duration(milliseconds: 1000),
                              curve: Curves.easeOutCubic,
                              builder: (context, value, _) {
                                Color barColor;
                                if (budget.percentUsed > 100) {
                                  barColor = GastifyTheme.accentRose;
                                } else if (budget.percentUsed > 80) {
                                  barColor = GastifyTheme.accentAmber;
                                } else {
                                  barColor = category.color;
                                }
                                return LinearProgressIndicator(
                                  value: value,
                                  backgroundColor: Colors.white.withValues(alpha: 0.05),
                                  valueColor: AlwaysStoppedAnimation<Color>(barColor),
                                  minHeight: 6,
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
                childCount: provider.budgets.length,
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        );
      },
    );
  }

  Widget _buildGoals(BuildContext context, TransactionProvider provider) {
    if (provider.goals.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Metas de ahorro', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          ...provider.goals.map((goal) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: GlassCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(goal.emoji, style: const TextStyle(fontSize: 28)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(goal.name, style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 2),
                            Text(
                              '${(goal.progress * 100).toStringAsFixed(0)}% completado',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: goal.progress > 0.7
                                    ? GastifyTheme.accentEmerald
                                    : GastifyTheme.textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0, end: goal.progress),
                      duration: const Duration(milliseconds: 1200),
                      curve: Curves.easeOutCubic,
                      builder: (context, value, _) {
                        return LinearProgressIndicator(
                          value: value,
                          backgroundColor: Colors.white.withValues(alpha: 0.08),
                          valueColor: AlwaysStoppedAnimation<Color>(
                            goal.progress > 0.7
                                ? GastifyTheme.accentEmerald
                                : GastifyTheme.primaryViolet,
                          ),
                          minHeight: 8,
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      AnimatedCounter(
                        value: goal.currentAmount,
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          color: GastifyTheme.accentEmerald,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        'Meta: \$${goal.targetAmount.toStringAsFixed(0)}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          )),
        ],
      ),
    );
  }
}
