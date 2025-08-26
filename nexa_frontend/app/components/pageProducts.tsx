import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { api } from "../../services/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function PageProducts() {
  const [produtos, setProdutos] = useState<Product[]>([]);

  const loadProducts = async () => {
    const response = await api.fetchProducts();
    setProdutos(response);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {produtos.length > 0 ? (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 15,
                padding: 10,
                borderWidth: 1,
                borderColor: "#1A202C",
                borderRadius: 8,
                backgroundColor: "#1A202C",
              }}
            >
              <Text style={{ color: "#fff" }}>ID: {item.id}</Text>
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
                {item.name}
              </Text>
              <Text style={{ color: "#fff" }}>{item.description}</Text>
              <Text style={{ color: "#fff" }}>R$: {item.price.toFixed(2)}</Text>
              <Text style={{ color: "#fff" }}>Estoque: {item.stock}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ color: "#000" }}>Carregando produtos...</Text>
      )}
    </View>
  );
}
