import { atom, computed } from 'nanostores'

import { shuffle } from '@/lib/utils'

type THRoleStr = 'MT' | 'ST' | 'H1' | 'H2'
type DPSRoleStr = 'D1' | 'D2' | 'D3' | 'D4'

export type RoleStr = THRoleStr | DPSRoleStr

export const $thOrders = atom<THRoleStr[]>(shuffle(['MT', 'ST', 'H1', 'H2']))
export const $dpsOrders = atom<DPSRoleStr[]>(shuffle(['D1', 'D2', 'D3', 'D4']))
export const $thFirst = atom(Math.random() > 0.5)
export const $roleOrders = computed([$thOrders, $dpsOrders, $thFirst], (thOrders, dpsOrders, thFirst) => {
  const orders = []
  if (thFirst) {
    for (let i = 0; i < 4; i++) {
      orders.push(thOrders[i])
      orders.push(dpsOrders[i])
    }
  } else {
    for (let i = 0; i < 4; i++) {
      orders.push(dpsOrders[i])
      orders.push(thOrders[i])
    }
  }
  return orders as RoleStr[]
})

export function shuffleRoleOrder() {
  $thOrders.set(shuffle(['MT', 'ST', 'H1', 'H2']))
  $dpsOrders.set(shuffle(['D1', 'D2', 'D3', 'D4']))
  $thFirst.set(Math.random() > 0.5)
}
