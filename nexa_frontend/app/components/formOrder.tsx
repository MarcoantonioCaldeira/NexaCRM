import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { api } from "../../services/api";

type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type SelectedProduct = {
  id: number;
  quantity: number;
  price: number;
};


export default function FormOrder() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({});

  useEffect(() => {
    async function loadProducts() {
      const res = await api.fetchProducts();
      setProducts(res);
    }
    loadProducts();
  }, []);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts({ ...selectedProducts, [id]: { id, quantity: 1, price: products.find(p => p.id === id)?.price || 0 } });
    } else {
      const newSelected = { ...selectedProducts };
      delete newSelected[id];
      setSelectedProducts(newSelected);
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setSelectedProducts({ ...selectedProducts, [id]: { ...selectedProducts[id], quantity } });
  };

  const handleSubmit = async () => {
    const items = Object.entries(selectedProducts).map(([productId, { quantity, price }]) => ({
      productId: Number(productId),
      quantity,
      price
    }));

    await api.createOrder({ items });
    setSelectedProducts({});
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Selecione os produtos
      </Text>

      {products.map((product) => (
        <View key={product.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <CheckBox
            checked={selectedProducts[product.id] !== undefined}
            onPress={() =>
              handleCheckboxChange(product.id, selectedProducts[product.id] === undefined)
            }
          />
          <Text style={{ flex: 1 }}>{product.name}</Text>

          {selectedProducts[product.id] !== undefined && (
            <TextInput
              style={{ borderWidth: 1, padding: 4, width: 60, marginLeft: 8 }}
              keyboardType="numeric"
              value={selectedProducts[product.id].quantity.toString()}
              onChangeText={(val) => handleQuantityChange(product.id, Number(val))}
            />
          )}
        </View>
      ))}

      <Button title="Enviar Pedido" onPress={handleSubmit} />
    </ScrollView>
  );
}
