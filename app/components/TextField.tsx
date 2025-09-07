
import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";

type Props = TextInputProps & { label: string; error?: string };

export default function TextField({ label, error, ...rest }: Props) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6, fontSize: 14, color: "#222" }}>{label}</Text>
      <TextInput
        {...rest}
        style={[
          {
            borderWidth: 1,
            borderColor: error ? "#dc2626" : "#ccc",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            backgroundColor: "#fff",
          },
          rest.style as any,
        ]}
        placeholderTextColor="#999"
      />
      {!!error && <Text style={{ color: "#dc2626", marginTop: 4 }}>{error}</Text>}
    </View>
  );
}
