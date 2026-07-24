import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../config/theme.dart';
import '../models/transaction.dart';
import '../providers/transaction_provider.dart';
import '../widgets/glass_card.dart';
import '../widgets/animated_counter.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeOut,
    );
    _fadeController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<TransactionProvider>(
      builder: (context, provider, _) {
        return FadeTransition(
          opacity: _fadeAnimation,
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(child: _buildHeader(provider)),
              SliverToBoxAdapter(child: _buildSafeToSpend(provider)),
              SliverToBoxAdapter(child: _buildIncomeExpenseCards(provider)),
              SliverToBoxAdapter(child: _buildChart(provider)),
              SliverToBoxAdapter(child: _buildGoalsSection(provider)),
              SliverToBoxAdapter(child: _buildRecentTransactions(provider)),
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader(TransactionProvider provider) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 60, 20, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tu Balance',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: GastifyTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 4),
          AnimatedCounter(
            value: provider.balance,
            style: Theme.of(context).textTheme.displayLarge?.copyWith(
              fontWeight: FontWeight.w800,
              letterSpacing: -1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSafeToSpend(TransactionProvider provider) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: GlassCard(
        padding: const EdgeInsets.all(20),
        backgroundColor: GastifyTheme.primaryPurple.withValues(alpha: 0.15),
        border: Border.all(color: GastifyTheme.primaryPurple.withValues(alpha: 0.3)),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                gradient: GastifyTheme.primaryGradient,
                borderRadius: BorderRadius.circular(GastifyTheme.radiusMd),
              ),
              child: const Icon(Icons.shield_rounded, color: Colors.white, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Seguro para gastar hoy',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: GastifyTheme.textSecondary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 2),
                  AnimatedCounter(
                    value: provider.safeToSpend,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: GastifyTheme.accentEmerald,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: GastifyTheme.textMuted, size: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildIncomeExpenseCards(TransactionProvider provider) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: GlassCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: GastifyTheme.accentEmerald.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.arrow_downward_rounded, color: GastifyTheme.accentEmerald, size: 16),
                      ),
                      const SizedBox(width: 8),
                      Text('Ingresos', style: Theme.of(context).textTheme.bodySmall),
                    ],
                  ),
                  const SizedBox(height: 8),
                  AnimatedCounter(
                    value: provider.totalIncome,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: GastifyTheme.accentEmerald,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: GlassCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: GastifyTheme.accentRose.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.arrow_upward_rounded, color: GastifyTheme.accentRose, size: 16),
                      ),
                      const SizedBox(width: 8),
                      Text('Gastos', style: Theme.of(context).textTheme.bodySmall),
                    ],
                  ),
                  const SizedBox(height: 8),
                  AnimatedCounter(
                    value: provider.totalExpenses,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: GastifyTheme.accentRose,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChart(TransactionProvider provider) {
    final expenses = provider.expensesByCategory;
    if (expenses.isEmpty) return const SizedBox.shrink();

    final sortedEntries = expenses.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    final total = sortedEntries.fold<double>(0, (sum, e) => sum + e.value);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: GlassCard(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Distribución de gastos',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 180,
              child: Row(
                children: [
                  Expanded(
                    child: PieChart(
                      PieChartData(
                        sectionsSpace: 2,
                        centerSpaceRadius: 36,
                        sections: sortedEntries.take(6).map((entry) {
                          final category = Category.defaults.firstWhere(
                            (c) => c.id == entry.key,
                            orElse: () => Category.defaults.last,
                          );
                          final percentage = (entry.value / total * 100);
                          return PieChartSectionData(
                            value: entry.value,
                            title: '${percentage.toStringAsFixed(0)}%',
                            color: category.color,
                            radius: 45,
                            titleStyle: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: sortedEntries.take(5).map((entry) {
                        final category = Category.defaults.firstWhere(
                          (c) => c.id == entry.key,
                          orElse: () => Category.defaults.last,
                        );
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            children: [
                              Container(
                                width: 10, height: 10,
                                decoration: BoxDecoration(
                                  color: category.color,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  category.name,
                                  style: Theme.of(context).textTheme.bodySmall,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalsSection(TransactionProvider provider) {
    if (provider.goals.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Metas de ahorro', style: Theme.of(context).textTheme.titleMedium),
              Text('Ver todas', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: GastifyTheme.primaryViolet)),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 140,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              itemCount: provider.goals.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final goal = provider.goals[index];
                return SizedBox(
                  width: 200,
                  child: GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(goal.emoji, style: const TextStyle(fontSize: 24)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                goal.name,
                                style: Theme.of(context).textTheme.titleSmall,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const Spacer(),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: TweenAnimationBuilder<double>(
                            tween: Tween(begin: 0, end: goal.progress),
                            duration: const Duration(milliseconds: 1200),
                            curve: Curves.easeOutCubic,
                            builder: (context, value, _) {
                              return LinearProgressIndicator(
                                value: value,
                                backgroundColor: Colors.white.withValues(alpha: 0.1),
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  goal.progress > 0.7 ? GastifyTheme.accentEmerald : GastifyTheme.primaryViolet,
                                ),
                                minHeight: 6,
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '\$${goal.currentAmount.toStringAsFixed(0)} / \$${goal.targetAmount.toStringAsFixed(0)}',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentTransactions(TransactionProvider provider) {
    final recent = provider.recentTransactions;
    if (recent.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Transacciones recientes', style: Theme.of(context).textTheme.titleMedium),
              Text('Ver todas', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: GastifyTheme.primaryViolet)),
            ],
          ),
          const SizedBox(height: 12),
          ...recent.take(5).map((transaction) => _buildTransactionTile(transaction)),
        ],
      ),
    );
  }

  Widget _buildTransactionTile(Transaction transaction) {
    final isExpense = transaction.type == TransactionType.expense;
    final category = transaction.category;

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: GlassCard(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
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
                  Text(
                    transaction.note ?? category.name,
                    style: Theme.of(context).textTheme.titleSmall,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Text(
                        category.name,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      if (transaction.isRecurring) ...[
                        const SizedBox(width: 6),
                        const Icon(
                          Icons.repeat_rounded,
                          size: 12,
                          color: GastifyTheme.textMuted,
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            Text(
              '${isExpense ? '-' : '+'}\$${transaction.amount.toStringAsFixed(0)}',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: isExpense ? GastifyTheme.accentRose : GastifyTheme.accentEmerald,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
