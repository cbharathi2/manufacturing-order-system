import { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchOrders,
  fetchOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  fetchOrderStatistics,
  setFilters,
  clearFilters,
  clearCurrentOrder,
} from '@/store/slices/orderSlice'
import { OrderFilters, Order, OrderCreateData, OrderUpdateData } from '@/types'

export const useOrders = () => {
  const dispatch = useAppDispatch()
  const { orders, currentOrder, pagination, filters, statistics, isLoading, error } = useAppSelector((state) => state.orders)

  const [selectedOrders, setSelectedOrders] = useState<number[]>([])

  const loadOrders = useCallback(async (page?: number, filters?: OrderFilters) => {
    await dispatch(fetchOrders({ page, filters }))
  }, [dispatch])

  const loadOrder = useCallback(async (id: string | number) => {
    await dispatch(fetchOrder(id))
  }, [dispatch])

  const addOrder = useCallback(async (data: OrderCreateData) => {
    const result = await dispatch(createOrder(data))
    return result
  }, [dispatch])

  const editOrder = useCallback(async (id: string | number, data: OrderUpdateData) => {
    const result = await dispatch(updateOrder({ id, data }))
    return result
  }, [dispatch])

  const removeOrder = useCallback(async (id: string | number) => {
    const result = await dispatch(deleteOrder(id))
    return result
  }, [dispatch])

  const changeOrderStatus = useCallback(async (id: string | number, status: string, remarks?: string) => {
    const result = await dispatch(updateOrderStatus({ id, status, remarks }))
    return result
  }, [dispatch])

  const loadStatistics = useCallback(async () => {
    await dispatch(fetchOrderStatistics())
  }, [dispatch])

  const applyFilters = useCallback((newFilters: OrderFilters) => {
    dispatch(setFilters(newFilters))
    loadOrders(1, newFilters)
  }, [dispatch, loadOrders])

  const resetFilters = useCallback(() => {
    dispatch(clearFilters())
    loadOrders(1)
  }, [dispatch, loadOrders])

  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder())
  }, [dispatch])

  const selectOrder = useCallback((id: number) => {
    setSelectedOrders(prev => [...prev, id])
  }, [])

  const deselectOrder = useCallback((id: number) => {
    setSelectedOrders(prev => prev.filter(orderId => orderId !== id))
  }, [])

  const toggleOrderSelection = useCallback((id: number) => {
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(orderId => orderId !== id)
        : [...prev, id]
    )
  }, [])

  const selectAllOrders = useCallback(() => {
    setSelectedOrders(orders.map(order => order.id))
  }, [orders])

  const deselectAllOrders = useCallback(() => {
    setSelectedOrders([])
  }, [])

  const getSelectedOrders = useCallback((): Order[] => {
    return orders.filter(order => selectedOrders.includes(order.id))
  }, [orders, selectedOrders])

  return {
    // State
    orders,
    currentOrder,
    pagination,
    filters,
    statistics,
    isLoading,
    error,
    selectedOrders,
    
    // Actions
    loadOrders,
    loadOrder,
    addOrder,
    editOrder,
    removeOrder,
    changeOrderStatus,
    loadStatistics,
    applyFilters,
    resetFilters,
    clearOrder,
    
    // Selection
    selectOrder,
    deselectOrder,
    toggleOrderSelection,
    selectAllOrders,
    deselectAllOrders,
    getSelectedOrders,
  }
}