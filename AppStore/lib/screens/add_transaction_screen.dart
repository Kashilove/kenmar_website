import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/transaction.dart';
import '../providers/transaction_provider.dart';
import '../widgets/glass_card.dart';

class AddTransactionScreen extends StatefulWidget {
  const AddTransactionScreen({super.key});

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen>
    with SingleTickerProviderStateMixin {
  TransactionType _type = TransactionType.expense;
  String _selectedCategoryId = 'food';
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();
  bool _isRecurring = false;
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _scaleAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOutBack,
    );
    _animController.forward();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _noteController.dispose();
    _animController.dispose();
    super.dispose();
  }

  List<Category> get _categories => _type == TransactionType.expense
      ? Category.expenseCategories
      : Category.incomeCategories;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: GastifyTheme.bgDark,
      body: ScaleTransition(
        scale: _scaleAnimation,
        child: SafeArea(
          child: Column(
            children: [
              _buildTopBar(),
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildTypeSelector(),
                      const SizedBox(height: 24),
                      _buildAmountInput(),
                      const SizedBox(height: 24),
                      _buildCategoryGrid(),
                      const SizedBox(height: 24),
                      _buildNoteInput(),
                      const SizedBox(height: 16),
                      _buildRecurringToggle(),
                      const SizedBox(height: 32),
                      _buildSaveButton(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.close_rounded, color: GastifyTheme.textSecondary),
          ),
          const Spacer(),
          Text(
            'Nueva transacción',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const Spacer(),
          const SizedBox(width: 48),
        ],
      ),
    );
  }

  Widget _buildTypeSelector() {
    return GlassCard(
      padding: const EdgeInsets.all(4),
      borderRadius: GastifyTheme.radiusFull,
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() {
                _type = TransactionType.expense;
                _selectedCategoryId = 'food';
              }),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  gradient: _type == TransactionType.expense
                      ? GastifyTheme.expenseGradient
                      : null,
                  borderRadius: BorderRadius.circular(GastifyTheme.radiusFull),
                ),
                child: Center(
                  child: Text(
                    'Gasto',
                    style: TextStyle(
                      color: _type == TransactionType.expense
                          ? Colors.white
                          : GastifyTheme.textMuted,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() {
                _type = TransactionType.income;
                _selectedCategoryId = 'salary';
              }),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  gradient: _type == TransactionType.income
                      ? GastifyTheme.incomeGradient
                      : null,
                  borderRadius: BorderRadius.circular(GastifyTheme.radiusFull),
                ),
                child: Center(
                  child: Text(
                    'Ingreso',
                    style: TextStyle(
                      color: _type == TransactionType.income
                          ? Colors.white
                          : GastifyTheme.textMuted,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAmountInput() {
    final color = _type == TransactionType.expense
        ? GastifyTheme.accentRose
        : GastifyTheme.accentEmerald;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Monto', style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 8),
        GlassCard(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          child: Row(
            children: [
              Text(
                '\$',
                style: TextStyle(
                  color: color,
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _amountController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
                  ],
                  style: TextStyle(
                    color: color,
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                  ),
                  decoration: const InputDecoration(
                    hintText: '0',
                    hintStyle: TextStyle(color: GastifyTheme.textMuted, fontSize: 32),
                    border: InputBorder.none,
                    filled: false,
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Categoría', style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 12),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 0.85,
          ),
          itemCount: _categories.length,
          itemBuilder: (context, index) {
            final cat = _categories[index];
            final isSelected = cat.id == _selectedCategoryId;
            return GestureDetector(
              onTap: () => setState(() => _selectedCategoryId = cat.id),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: isSelected
                      ? cat.color.withValues(alpha: 0.2)
                      : GastifyTheme.bgCardLight,
                  borderRadius: BorderRadius.circular(GastifyTheme.radiusMd),
                  border: Border.all(
                    color: isSelected ? cat.color : Colors.transparent,
                    width: 2,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(cat.icon, color: cat.color, size: 26),
                    const SizedBox(height: 6),
                    Text(
                      cat.name,
                      style: TextStyle(
                        color: isSelected ? cat.color : GastifyTheme.textSecondary,
                        fontSize: 11,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                      ),
                      textAlign: TextAlign.center,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildNoteInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Nota (opcional)', style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 8),
        TextField(
          controller: _noteController,
          style: const TextStyle(color: GastifyTheme.textPrimary),
          decoration: InputDecoration(
            hintText: 'Ej: Café con amigos',
            hintStyle: const TextStyle(color: GastifyTheme.textMuted),
            prefixIcon: const Icon(Icons.edit_note_rounded, color: GastifyTheme.textMuted),
            filled: true,
            fillColor: GastifyTheme.bgCardLight,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(GastifyTheme.radiusMd),
              borderSide: BorderSide.none,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRecurringToggle() {
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Row(
        children: [
          const Icon(Icons.repeat_rounded, color: GastifyTheme.textSecondary, size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Gasto recurrente',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: GastifyTheme.textPrimary),
            ),
          ),
          Switch(
            value: _isRecurring,
            onChanged: (v) => setState(() => _isRecurring = v),
            activeColor: GastifyTheme.primaryViolet,
          ),
        ],
      ),
    );
  }

  Widget _buildSaveButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: _type == TransactionType.expense
              ? GastifyTheme.expenseGradient
              : GastifyTheme.incomeGradient,
          borderRadius: BorderRadius.circular(GastifyTheme.radiusMd),
          boxShadow: GastifyTheme.glowShadow(
            _type == TransactionType.expense
                ? GastifyTheme.accentRose
                : GastifyTheme.accentEmerald,
          ),
        ),
        child: ElevatedButton(
          onPressed: _saveTransaction,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(GastifyTheme.radiusMd),
            ),
          ),
          child: const Text(
            'Guardar transacción',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white),
          ),
        ),
      ),
    );
  }

  void _saveTransaction() {
    final amount = double.tryParse(_amountController.text);
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Ingresa un monto válido'),
          backgroundColor: GastifyTheme.accentRose,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      return;
    }

    final transaction = Transaction(
      amount: amount,
      categoryId: _selectedCategoryId,
      type: _type,
      note: _noteController.text.isNotEmpty ? _noteController.text : null,
      isRecurring: _isRecurring,
    );

    context.read<TransactionProvider>().addTransaction(transaction);
    Navigator.pop(context);
  }
}
