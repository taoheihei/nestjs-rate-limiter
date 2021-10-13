import { Module, DynamicModule, Provider } from '@nestjs/common'
import { defaultRateLimiterOptions } from './default-options'
import { RateLimiterOptions, RateLimiterModuleAsyncOptions, RateLimiterOptionsFactory } from './rate-limiter.interface'

@Module({
	exports: ['RATE_LIMITER_OPTIONS_IP'],
	providers: [{ provide: 'RATE_LIMITER_OPTIONS_IP', useValue: defaultRateLimiterOptions }]
})
export class RateLimiterIPModule {
	static register(options: RateLimiterOptions = defaultRateLimiterOptions): DynamicModule {
		return {
			module: RateLimiterIPModule,
			providers: [{ provide: 'RATE_LIMITER_OPTIONS_IP', useValue: options }]
		}
	}

	static registerAsync(options: RateLimiterModuleAsyncOptions): DynamicModule {
		return {
			module: RateLimiterIPModule,
			imports: options.imports,
			providers: [...this.createAsyncProviders(options), ...(options.extraProviders || [])]
		}
	}

	private static createAsyncProviders(options: RateLimiterModuleAsyncOptions): Provider[] {
		if (options.useExisting || options.useFactory) {
			return [this.createAsyncOptionsProvider(options)]
		}
		return [
			this.createAsyncOptionsProvider(options),
			{
				provide: options.useClass,
				useClass: options.useClass
			}
		]
	}

	private static createAsyncOptionsProvider(options: RateLimiterModuleAsyncOptions): Provider {
		if (options.useFactory) {
			return {
				provide: 'RATE_LIMITER_OPTIONS',
				useFactory: options.useFactory,
				inject: options.inject || []
			}
		}
		return {
			provide: 'RATE_LIMITER_OPTIONS',
			useFactory: async (optionsFactory: RateLimiterOptionsFactory) => optionsFactory.createRateLimiterOptions(),
			inject: [options.useExisting || options.useClass]
		}
	}
}
