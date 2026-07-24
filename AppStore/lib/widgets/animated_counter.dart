import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AnimatedCounter extends StatelessWidget {
  final double value;
  final TextStyle? style;
  final String prefix;
  final String suffix;
  final Duration duration;
  final int decimals;

  const AnimatedCounter({
    super.key,
    required this.value,
    this.style,
    this.prefix = '\$',
    this.suffix = '',
    this.duration = const Duration(milliseconds: 800),
    this.decimals = 0,
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: value),
      duration: duration,
      curve: Curves.easeOutCubic,
      builder: (context, animatedValue, child) {
        final formatter = NumberFormat.currency(
          symbol: prefix,
          decimalDigits: decimals,
          locale: 'es_MX',
        );
        return Text(
          '${formatter.format(animatedValue)}$suffix',
          style: style ?? Theme.of(context).textTheme.headlineLarge,
        );
      },
    );
  }
}
