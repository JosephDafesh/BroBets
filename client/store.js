import {create} from 'zustand'

export const useStore = create((set, get) => ({
  user_id: null,
  setUser_id: (user_id) => set({user_id}),

  event_id: null,
  setEvent_id: (event_id) => set({event_id}),

  events: [],
  setEvents: (events) => set({events}),



}))