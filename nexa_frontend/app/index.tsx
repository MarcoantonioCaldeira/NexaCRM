import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import styled from "styled-components/native";
import PageOrders from "./pages/pageOrders";
import PageProducts from "./pages/pageProducts";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = React.useState<'produtos' | 'pedidos'>('produtos');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Container>
        <Header>
          <Title>Nexa CRM</Title>
          <TabContainer>
            <TabText 
              active={activeTab === 'produtos'}
              onPress={() => setActiveTab('produtos')}
            >
              Produtos
            </TabText>
            <TabText 
              active={activeTab === 'pedidos'}
              onPress={() => setActiveTab('pedidos')}
            >
              Pedidos
            </TabText>
          </TabContainer>
        </Header>

        {activeTab === 'produtos' ? <PageProducts /> : <PageOrders />}
      </Container>
    </GestureHandlerRootView>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #232C3A;
`;

const Header = styled.View`
  align-items: center;
  margin-bottom: 20px;
  background-color: #1A202C;
  width: 100%;
  padding: 10px;
`;

const Title = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 18px;
`;

const TabContainer = styled.View`
  flex-direction: row;
  margin-vertical: 10px;
  padding: 5px;
  border-radius: 5px;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${({ active }) => (active ? '#fff' : '#f0f0f0')};
  margin-right: 10px;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
`;