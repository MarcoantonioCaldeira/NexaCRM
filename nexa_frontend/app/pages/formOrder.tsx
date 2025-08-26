import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { CheckBox } from "react-native-elements";
import styled from "styled-components/native";
import { api } from "../../services/api";


type Product = {
  id: number;
  name: string;
  price: number;
};

type OrderItem = {
  quantity: number;
  product: Product;
};

type SelectedProduct = {
  id: number;
  quantity: number;
  price: number;
};

type Props = {
  mode?: "create" | "edit";
  initialOrder?: {
    id?: number;
    status?: string;
    items: OrderItem[];
  };
  onSubmit?: (payload: any) => Promise<void>;
};

export default function FormOrder({ mode = "create", initialOrder, onSubmit }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({});
  const [status, setStatus] = useState(initialOrder?.status || "pending");

  useEffect(() => {
    async function loadProducts() {
      const res = await api.fetchProducts();
      setProducts(res);

      if (mode === "edit" && initialOrder) {
        const preSelected: Record<number, SelectedProduct> = {};
        initialOrder.items.forEach((item) => {
          preSelected[item.product.id] = {
            id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          };
        });
        setSelectedProducts(preSelected);
      }
    }
    loadProducts();
  }, [mode, initialOrder]);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts({
        ...selectedProducts,
        [id]: {
          id,
          quantity: 1,
          price: products.find((p) => p.id === id)?.price || 0,
        },
      });
    } else {
      const newSelected = { ...selectedProducts };
      delete newSelected[id];
      setSelectedProducts(newSelected);
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setSelectedProducts({
      ...selectedProducts,
      [id]: { ...selectedProducts[id], quantity },
    });
  };

  const handleSubmit = async () => {
    const items = Object.entries(selectedProducts).map(([id, { quantity, price }]) => {
      const productData = {
        id: Number(id),
        name: products.find((p) => p.id === Number(id))?.name || "",
        price,
      };

      if (mode === "edit") {
        return { quantity, product: productData };
      } else {
        return { productId: Number(id), quantity, price };
      }
    });

    const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const payload = {
      totalPrice,
      status,
      items,
    };

    if (onSubmit) {
      await onSubmit(payload);
    }
    setSelectedProducts({});
  };

  return (
    <FormContainer>
      <Title>{mode === "edit" ? "Editar Pedido" : "Novo Pedido"}</Title>

      {mode === "edit" && (
        <StatusSection>
          <Label>Status:</Label>
          <StyledPicker
            selectedValue={status}
            onValueChange={(val) => setStatus(val)}
          >
            <Picker.Item label="Pendente" value="pending" />
            <Picker.Item label="Processando" value="processing" />
            <Picker.Item label="Entregue" value="delivered" />
            <Picker.Item label="Cancelado" value="cancelled" />
          </StyledPicker>
        </StatusSection>
      )}

      {products.map((product) => (
        <ProductRow key={product.id}>
          <CheckBox
            checkedColor="#2e64e5"
            containerStyle={{ backgroundColor: 'transparent', padding: 0 }}
            checked={selectedProducts[product.id] !== undefined}
            onPress={() => handleCheckboxChange(product.id, selectedProducts[product.id] === undefined)}
          />
          <ProductName>{product.name}</ProductName>

          {selectedProducts[product.id] !== undefined && (
            <QuantityInput
              keyboardType="numeric"
              value={selectedProducts[product.id].quantity.toString()}
              onChangeText={(val) => handleQuantityChange(product.id, Number(val))}
            />
          )}
        </ProductRow>
      ))}

      <StyledButton onPress={handleSubmit}>
        <ButtonText>{mode === "edit" ? "Salvar Alterações" : "Enviar Pedido"}</ButtonText>
      </StyledButton>
    </FormContainer>
  );
}

const FormContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #1A202C;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
`;

const StatusSection = styled.View`
  background-color: #282c34;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: #bdc3c7;
  margin-bottom: 5px;
`;

const StyledPicker = styled(Picker)`
  color: #fff;
  background-color: #3e4451;
`;

const ProductRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 0;
`;

const ProductName = styled.Text`
  flex: 1;
  color: #fff;
  font-size: 16px;
`;

const QuantityInput = styled.TextInput`
  border-width: 1px;
  border-color: #444;
  border-radius: 4px;
  padding: 8px;
  width: 60px;
  margin-left: 10px;
  color: #fff;
  background-color: #3e4451;
  text-align: center;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #2e64e5;
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 20px;
  width: 100%;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  text-align: center;
`;