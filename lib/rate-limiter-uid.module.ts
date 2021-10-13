import { Module, DynamicModule, Provider } from '@nestjs/common'
import { defaultRateLimiterOptions } from './default-options'
import { RateLimiterOptions, RateLimiterModuleAsyncOptions, RateLimiterOptionsFactory } from './rate-limiter.interface'

@Module({
	exports: ['RATE_LIMITER_OPTIONS_UID'],
	providers: [{ provide: 'RATE_LIMITER_OPTIONS_UID', useValue: defaultRateLimiterOptions }]
})
export class RateLimiterUIDModule {
	static register(options: RateLimiterOptions = defaultRateLimiterOptions): DynamicModule {
		return {
			module: RateLimiterUIDModule,
			providers: [{ provide: 'RATE_LIMITER_OPTIONS_UID', useValue: options }]
		}
	}

	static registerAsync(options: RateLimiterModuleAsyncOptions): DynamicModule {
		return {
			module: RateLimiterUIDModule,
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
				provide: 'RATE_LIMITER_OPTIONS_UID',
				useFactory: options.useFactory,
				inject: options.inject || []
			}
		}
		return {
			provide: 'RATE_LIMITER_OPTIONS_UID',
			useFactory: async (optionsFactory: RateLimiterOptionsFactory) => optionsFactory.createRateLimiterOptions(),
			inject: [options.useExisting || options.useClass]
		}
	}
}
