import {create} from 'zustand'

export const useStore = create((set, get) => ({
    events: [],
    setEvents: (events) => set({events}),


}))