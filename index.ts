import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import * as grpc from "@grpc/grpc-js";

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { DebugSimpleSpanProcessor } from "./DebugSimpleSpanProcessor";
import { Resource } from "@opentelemetry/resources";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const provider = new NodeTracerProvider({
    resource: new Resource({
        'service.name': 'amir-grpc-troubleshooting',
        'deployment.environment': 'staging',
        'aspecto.token': 'YOUR_TOKEN'
    })
});
provider.addSpanProcessor(
    new DebugSimpleSpanProcessor(
      new OTLPTraceExporter({
        url: "localhost:4317",
        credentials: grpc.credentials.createInsecure(),
      })
    )
  );  
provider.register();

provider.getTracer("grpc-test").startSpan("grpc test span").end();

setTimeout(async () => {
    await provider.forceFlush();
    await provider.shutdown();
    console.log("done");
}, 4000);

