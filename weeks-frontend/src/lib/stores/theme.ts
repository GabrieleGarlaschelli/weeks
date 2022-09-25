import { browser } from '$app/env';
import { writable } from "svelte/store";
import Cookies from 'js-cookie'

const store = writable<'light' | 'dark'>('light')
export default store

if(browser) {
  // @ts-ignore
  let theme: 'light' | 'dark' = Cookies.get('theme')
  if(!!theme) {
    store.set(theme)
  }
}

store.subscribe((theme) => {
  if(browser) {
    document.body.setAttribute('data-theme', theme)
    Cookies.set('theme', theme)
  }
})