import { browser } from '$app/env';
import { derived } from "svelte/store";
import theme from './theme'

export type Colors = {
  primary: string,
  secondary: string,
  tertiary: string,
  background: string,
  contrast: string,
  lightContrast: string
  thinContrast: string,
  warning: string
}

let lighColors: Colors = {
  primary: '#1498D5',
  secondary: '#72C1E6',
  tertiary: '#B8E0F2',
  background: '#EFF2F3',
  contrast: '#143342',
  lightContrast: '#778B95',
  thinContrast: '#DFDFDF',
  warning: '#AD0000'
}

let darkColors: Colors = {
  primary: '#197BAA',
  secondary: '#40A3D1', 
  tertiary: '#87C4E0',
  background: '#143342',
  contrast: '#EFF2F3',
  lightContrast: '#A3A3A3',
  thinContrast: '#314954',
  warning: '#AD0000'
}

const store = derived<typeof theme, Colors>(theme, $theme => $theme == 'light' ? lighColors : darkColors)
export default store

store.subscribe((newColors) => {
  if(browser) {
    document.documentElement.style.setProperty("--global-primary-color", newColors.primary);
    document.documentElement.style.setProperty("--global-secondary-color", newColors.secondary);
    document.documentElement.style.setProperty("--global-tertiary-color", newColors.tertiary);
    document.documentElement.style.setProperty("--global-background-color", newColors.background);
    document.documentElement.style.setProperty("--global-contrast-color", newColors.contrast);
    document.documentElement.style.setProperty("--global-light-contrast-color", newColors.lightContrast);
    document.documentElement.style.setProperty("--global-thin-contrast-color", newColors.thinContrast);
  }
})