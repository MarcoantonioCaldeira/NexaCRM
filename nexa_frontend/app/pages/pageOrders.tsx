import React, { useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { api } from "../../services/api";
import FormOrder from "./formOrder";


type Order = {
  id: number;
  totalPrice: number;
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
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

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

  const handleEdit = (order: Order) => {
    setOrderToEdit(order);
    setShowForm(true);
  };

  const renderLeftActions = (order: Order) => (
    <SwipeableButton color="#2e64e5" onPress={() => handleEdit(order)}>
      <SwipeableButtonText>Editar</SwipeableButtonText>
    </SwipeableButton>
  );

  const renderRightActions = (id: number) => (
    <SwipeableButton color="#e74c3c" onPress={() => deleteOrder(id)}>
      <SwipeableButtonText>Deletar</SwipeableButtonText>
    </SwipeableButton>
  );

  const renderOrder = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderIds.includes(item.id);

    return (
      <Swipeable
        renderLeftActions={() => renderLeftActions(item)}
        renderRightActions={() => renderRightActions(item.id)}
      >
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <OrderCard>
            {/* Resumo */}
            <CardSummaryRow>
              <CardSummaryText>R$ {item.totalPrice}</CardSummaryText>
              <StatusText status={item.status}>{item.status.toUpperCase()}</StatusText>
            </CardSummaryRow>

            {/* Detalhes do pedido */}
            {isExpanded && (
              <ExpandedDetails>
                {item.items?.map((i, idx) => (
                  <DetailLine key={idx}>
                    {`Qtde: ${i.quantity} | Produto: ${i.product.name} | Preço: R$${i.product.price}`}
                  </DetailLine>
                ))}
                {item.createdAt && (
                  <DetailLine>
                    Criado em: {new Date(item.createdAt).toLocaleString()}
                  </DetailLine>
                )}
              </ExpandedDetails>
            )}
          </OrderCard>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <PageContainer>
      {showForm ? (
        <FormOrder
          mode={orderToEdit ? "edit" : "create"}
          initialOrder={orderToEdit || undefined}
          onSubmit={async (payload) => {
            if (orderToEdit) {
              await api.updateOrder(orderToEdit.id, payload);
            } else {
              await api.createOrder(payload);
            }
            setShowForm(false);
            setOrderToEdit(null);
            loadOrders();
          }}
        />
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
        />
      ) : (
        <NoOrdersText>Nenhum pedido encontrado. Crie um novo!</NoOrdersText>
      )}

      {!showForm && (
        <StyledButton
          onPress={() => {
            setOrderToEdit(null);
            setShowForm(true);
          }}
        >
          <ButtonText>Novo Pedido</ButtonText>
        </StyledButton>
      )}
    </PageContainer>
  );
}

const PageContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #2e64e5;
  padding: 12px 20px;
  border: 1px solid #2e64e5;
  border-radius: 8px;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  text-align: center;
`;

const OrderCard = styled.View`
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 12px;
  background-color: #1A202C;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 5;
`;

const CardSummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const CardSummaryText = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #fff;
`;

const StatusText = styled.Text<{ status: string }>`
  font-weight: bold;
  font-size: 14px;
  color: ${(props) => {
    switch (props.status) {
      case "delivered":
        return "#27ae60"; 
      case "cancelled":
        return "#e74c3c"; 
      case "pending":
      case "processing":
        return "#f39c12"; 
      default:
        return "#bdc3c7"; 
    }
  }};
`;

const CardDetailText = styled.Text`
  color: #bdc3c7;
  font-size: 14px;
`;

const ExpandedDetails = styled.View`
  margin-top: 15px;
  border-top-width: 1px;
  border-top-color: #3e4451;
  padding-top: 15px;
`;

const DetailLine = styled.Text`
  color: #bdc3c7;
  font-size: 13px;
  margin-bottom: 5px;
`;

const SwipeableButton = styled.TouchableOpacity<{ color: string }>`
  background-color: ${(props) => props.color};
  justify-content: center;
  border-radius: 8px;
  align-items: center;
  min-width: 80px;
  padding-top: 10px;
  height: 100%;
  padding: 0 10px;
`;

const SwipeableButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  padding: 4px 8px;
`;

const LoadingText = styled.Text`
  color: #fff;
`;

const NoOrdersText = styled.Text`
  color: #fff;
  text-align: center;
  margin-top: 50px;
`;