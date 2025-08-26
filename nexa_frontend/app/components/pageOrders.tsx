// app/orders.tsx
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { api } from "../../services/api"; // ajuste conforme sua estrutura
import FormOrder from './formOrder';

type Order = {
  id: number;
  calculatedTotalPrice: number;
  status: string;
  items?: {
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
    };
  }[];
  createdAt?: string;
};

export default function PageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState<number[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await api.fetchOrders();
    setOrders(res);
  };

  const deleteOrder = async (id: number) => {
    try {
      await api.deleteOrder(id);
      setOrders(orders.filter((pedido) => pedido.id !== id));
    } catch (err) {
      Alert.alert("Erro", "Não foi possível deletar o pedido.");
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderIds.includes(item.id);

    return (
      <Swipeable
        renderRightActions={() => (
          <View
            style={{
              backgroundColor: "red",
              justifyContent: "center",
              alignItems: "flex-end",
              paddingHorizontal: 20,
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Deletar</Text>
          </View>
        )}
        onSwipeableOpen={() => deleteOrder(item.id)}
      >
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
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
            {/* Resumo */}
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
              Valor: R$ {item.calculatedTotalPrice}
            </Text>
            <Text style={{ color: "#fff" }}>Status: {item.status}</Text>

            {/* Detalhes do pedido */}
            {isExpanded && (
              <View style={{ marginTop: 10 }}>
                {item.items?.map((i, idx) => (
                  <Text key={idx} style={{ color: "#fff" }}>
                   ID: {i.product.id} | Quantidade: {i.quantity} | Preço: R${i.product.price} | Produto: {i.product.name}
                  </Text>
                ))}
                {item.createdAt && (
                  <Text style={{ color: "#fff", marginTop: 5 }}>
                    Criado em: {new Date(item.createdAt).toLocaleString()}
                  </Text>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {showForm ? (
        <FormOrder />
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
        />
      ) : (
        <Text style={{ color: "#000" }}>Carregando pedidos...</Text>
      )}

      {!showForm && <Button title="Novo Pedido" onPress={() => setShowForm(true)} />}
    </View>
  );
}
