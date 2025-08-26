import React from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PageOrders from "./components/pageOrders";
import PageProducts from "./components/pageProducts";

export default function HomeScreen() {
  const [activeTab, setActiveTab] = React.useState<'produtos' | 'pedidos'>('produtos');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#232C3A', flex: 1 }}>
        <View style={{ alignItems: 'center', marginBottom: 20, backgroundColor: '#1A202C',  width: '100%', padding: 10 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Nexa CRM</Text>
          <View style={{ flexDirection: 'row', marginVertical: 10, padding: 5, borderRadius: 5 }}>
            <Text
              style={{ color: activeTab === 'produtos' ? '#fff' : '#f0f0f0', marginRight: 10 }}
              onPress={() => setActiveTab('produtos')}
            >
              Produtos
            </Text>
            <Text
              style={{ color: activeTab === 'pedidos' ? '#fff' : '#f0f0f0' }}
              onPress={() => setActiveTab('pedidos')}
            >
              Pedidos
            </Text>
          </View>
        </View>

        {activeTab === 'produtos' ? (
          <PageProducts />
        ) : (
          <PageOrders />
        )}
      </View>
    </GestureHandlerRootView>
  );
}
