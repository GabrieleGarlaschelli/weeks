import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { User } from "../services/users/user.service";


export default writable<User | undefined>(undefined)