import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
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
    <PageContainer>
      {produtos.length > 0 ? (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard>
              <ProductId>ID: {item.id}</ProductId>
              <ProductName>{item.name}</ProductName>
              <ProductDescription>{item.description}</ProductDescription>
              <ProductPrice>R$: {item.price.toFixed(2)}</ProductPrice>
              <ProductStock>Estoque: {item.stock}</ProductStock>
            </ProductCard>
          )}
        />
      ) : (
        <LoadingText>Carregando produtos...</LoadingText>
      )}
    </PageContainer>
  );
}

const PageContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const ProductCard = styled.View`
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 12px;
  background-color: #1A202C;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 5;
`;

const ProductId = styled.Text`
  color: #bdc3c7;
  font-size: 12px;
`;

const ProductName = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  margin-bottom: 5px;
`;

const ProductDescription = styled.Text`
  color: #bdc3c7;
  font-size: 14px;
  margin-bottom: 5px;
`;

const ProductPrice = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
`;

const ProductStock = styled.Text`
  color: #bdc3c7;
  font-size: 14px;
`;

const LoadingText = styled.Text`
  color: #fff;
  text-align: center;
  margin-top: 50px;
`;