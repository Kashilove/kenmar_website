import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'providers/transaction_provider.dart';
import 'screens/app_shell.dart';

void main() {
  runApp(const GastifyApp());
}

class GastifyApp extends StatelessWidget {
  const GastifyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TransactionProvider(),
      child: MaterialApp(
        title: 'Gastify — Tu dinero, tu control',
        debugShowCheckedModeBanner: false,
        theme: GastifyTheme.darkTheme,
        home: const AppShell(),
      ),
    );
  }
}
