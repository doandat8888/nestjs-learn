import { rm } from "fs/promises"
import { join } from "path"

global.beforeEach(async() => {
    //After test is executed, remove data in test database
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (error) {}
})