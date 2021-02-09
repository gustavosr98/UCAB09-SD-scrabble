import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';

// LOGGER
import * as rTracer from 'cls-rtracer';
import { WinstonModule, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import createOptions from '@/logger/winston';

// CUSTOM CODE
import { AppModule } from '@/app/app.module';
import { FinalFilter } from '@/common/filters/final.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(createOptions({ fileName: 'boots' })),
    });

    app.setGlobalPrefix('api/v1');
    app.enableCors({
        methods: ['GET', 'PATCH', 'DELETE', 'POST', 'PUT'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    });

    app.useGlobalFilters(new FinalFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)));
    app.use(helmet());
    app.use(rTracer.expressMiddleware());

    const config = new DocumentBuilder()
        .setTitle('Scrabble API')
        .setDescription('API REST v1.0')
        .addTag('Users')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document);

    await app.listen(process.env.PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
