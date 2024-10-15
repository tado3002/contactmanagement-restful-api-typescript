import { logger } from "./application/logging";
import { web } from "./application/web";

const port: number = 3000
web.listen(port, ()=>{
  logger.info("Listening on port "+port)
})
