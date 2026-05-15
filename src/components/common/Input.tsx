import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, SIZES, FONTS } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  input: {
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SPACING.md,
    ...FONTS.body1,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...FONTS.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});

export default Input;
