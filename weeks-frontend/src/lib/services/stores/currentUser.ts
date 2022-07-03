import { writable } from "svelte/store";
import { browser } from "$app/env";
import type { User } from "../user/user.service";


export default writable<User>(undefined)