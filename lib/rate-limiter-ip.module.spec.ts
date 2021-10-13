import { DynamicModule, Provider } from '@nestjs/common'
import { RateLimiterIPModule } from './rate-limiter-ip.module'
import { RateLimiterOptions, RateLimiterModuleAsyncOptions } from './rate-limiter.interface'

describe('RateLimiterModule', () => {
	it('should validate that RateLimiterModule exists', async () => {
		expect(RateLimiterIPModule).toBeDefined()
	})

	it('should register RateLimiterModule with empty options', async () => {
		const rateLimiterOptions: RateLimiterOptions = {}

		const registeredDynamicModule: DynamicModule = RateLimiterIPModule.register(rateLimiterOptions)

		expect(registeredDynamicModule).toBeDefined()
		expect(typeof registeredDynamicModule.module).toBeDefined()
		expect(registeredDynamicModule.providers.length).toBe(1)
		const rateLimitOptionsProvider: any = registeredDynamicModule.providers[0]
		expect(rateLimitOptionsProvider.provide).toBe('RATE_LIMITER_OPTIONS')
		expect(rateLimitOptionsProvider.useValue).toBeDefined()
	})

	it('should register RateLimiterModule with default options', async () => {
		const rateLimiterOptions: RateLimiterOptions = {}

		const registeredDynamicModule: DynamicModule = RateLimiterIPModule.register()

		expect(registeredDynamicModule).toBeDefined()
		expect(typeof registeredDynamicModule.module).toBeDefined()
		expect(registeredDynamicModule.providers.length).toBe(1)
		const rateLimitOptionsProvider: any = registeredDynamicModule.providers[0]
		expect(rateLimitOptionsProvider.provide).toBe('RATE_LIMITER_OPTIONS')
		expect(rateLimitOptionsProvider.useValue).toBeDefined()

		const options: RateLimiterOptions = rateLimitOptionsProvider.useValue

		expect(options.for).toBe('Express')
	})

	it('should register async RateLimiterModule with async options', async () => {
		const rateLimiterOptions: RateLimiterModuleAsyncOptions = {}

		const registeredDynamicModule: DynamicModule = RateLimiterIPModule.registerAsync(rateLimiterOptions)

		expect(registeredDynamicModule).toBeDefined()
		expect(typeof registeredDynamicModule.module).toBeDefined()
		expect(registeredDynamicModule.providers.length).toBe(2)
		const rateLimitOptionsProvider: any = registeredDynamicModule.providers[0]
		expect(rateLimitOptionsProvider.provide).toBe('RATE_LIMITER_OPTIONS')
		expect(rateLimitOptionsProvider.useFactory).toBeDefined()
		expect(rateLimitOptionsProvider.inject).toBeDefined()
	})
})
