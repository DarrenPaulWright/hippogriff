[**hippogriff**](README.md) • **Docs**

***

[hippogriff](README.md) / \<internal\>

# \<internal\>

## Interfaces

### ISettings

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `benchColors?` | \| `"none"` \| `"light"` \| `"bright"` \| `"dim"` \| `"cool"` \| `"passFail"` \| `"blue"` \| `"green"` \| `"magenta"` \| `"yellow"` \| `"cyan"` \| `"red"` | Color theme for bench charts. Default: "light". | [src/hippogriff.models.ts:76](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L76) |
| `benchDistinctCharts?` | `boolean` | Render individual charts for each describe/when. Default: false. | [src/hippogriff.models.ts:70](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L70) |
| `benchDuration?` | `boolean` | Render bench results as durations instead of operations per second. Default: false. | [src/hippogriff.models.ts:73](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L73) |
| `benchMaxDuration?` | `number` | Max total duration for each bench. Default: 200. | [src/hippogriff.models.ts:67](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L67) |
| `benchMaxSamples?` | `number` | Max samples to take per bench. Default: 100. | [src/hippogriff.models.ts:64](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L64) |
| `testTimeout?` | `number` | Timeout for tests in ms. Default: 2000. | [src/hippogriff.models.ts:61](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L61) |

## Type Aliases

### WorkCallback()

```ts
type WorkCallback: () => Promise<void> | void;
```

#### Returns

`Promise`\<`void`\> \| `void`

#### Defined in

[src/hippogriff.models.ts:7](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L7)
