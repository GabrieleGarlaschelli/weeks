import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { User } from "../users/user.service";


export default writable<User>(undefined)