import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../screens/home_screen.dart';
import '../screens/stats_screen.dart';
import '../screens/budgets_screen.dart';
import '../screens/add_transaction_screen.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _currentIndex = 0;

  final _screens = const [
    HomeScreen(),
    StatsScreen(),
    SizedBox(), // placeholder for FAB
    BudgetsScreen(),
    _SettingsPlaceholder(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: GastifyTheme.bgDark,
      body: IndexedStack(
        index: _currentIndex >= 2 ? _currentIndex : _currentIndex,
        children: _screens,
      ),
      floatingActionButton: _buildFAB(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildFAB() {
    return Container(
      height: 60,
      width: 60,
      decoration: BoxDecoration(
        gradient: GastifyTheme.primaryGradient,
        shape: BoxShape.circle,
        boxShadow: GastifyTheme.glowShadow(GastifyTheme.primaryPurple),
      ),
      child: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            PageRouteBuilder(
              pageBuilder: (_, __, ___) => const AddTransactionScreen(),
              transitionsBuilder: (_, animation, __, child) {
                return SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0, 1),
                    end: Offset.zero,
                  ).animate(CurvedAnimation(
                    parent: animation,
                    curve: Curves.easeOutCubic,
                  )),
                  child: child,
                );
              },
              transitionDuration: const Duration(milliseconds: 350),
            ),
          );
        },
        backgroundColor: Colors.transparent,
        elevation: 0,
        child: const Icon(Icons.add_rounded, color: Colors.white, size: 32),
      ),
    );
  }

  Widget _buildBottomBar() {
    return Container(
      decoration: BoxDecoration(
        color: GastifyTheme.bgCard,
        border: Border(
          top: BorderSide(
            color: Colors.white.withValues(alpha: 0.06),
            width: 1,
          ),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(Icons.home_rounded, 'Inicio', 0),
              _buildNavItem(Icons.bar_chart_rounded, 'Stats', 1),
              const SizedBox(width: 56), // space for FAB
              _buildNavItem(Icons.account_balance_wallet_rounded, 'Presupuesto', 3),
              _buildNavItem(Icons.settings_rounded, 'Ajustes', 4),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? GastifyTheme.primaryViolet : GastifyTheme.textMuted,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? GastifyTheme.primaryViolet : GastifyTheme.textMuted,
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingsPlaceholder extends StatelessWidget {
  const _SettingsPlaceholder();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.settings_rounded,
            size: 64,
            color: GastifyTheme.textMuted.withValues(alpha: 0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'Ajustes',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: GastifyTheme.textMuted,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Próximamente',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: GastifyTheme.textMuted.withValues(alpha: 0.5),
            ),
          ),
        ],
      ),
    );
  }
}
