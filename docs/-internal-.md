[**hippogriff**](README.md)

***

[hippogriff](README.md) / \<internal\>

# \<internal\>

## Interfaces

### ISettings

Defined in: [src/hippogriff.models.ts:58](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L58)

#### Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="benchcolors"></a> `benchColors?` | \| `"none"` \| `"light"` \| `"bright"` \| `"dim"` \| `"cool"` \| `"passFail"` \| `"blue"` \| `"green"` \| `"magenta"` \| `"yellow"` \| `"cyan"` \| `"red"` | Color theme for bench charts. Default: "light". | [src/hippogriff.models.ts:76](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L76) |
| <a id="benchdistinctcharts"></a> `benchDistinctCharts?` | `boolean` | Render individual charts for each describe/when. Default: false. | [src/hippogriff.models.ts:70](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L70) |
| <a id="benchduration"></a> `benchDuration?` | `boolean` | Render bench results as durations instead of operations per second. Default: false. | [src/hippogriff.models.ts:73](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L73) |
| <a id="benchmaxduration"></a> `benchMaxDuration?` | `number` | Max total duration for each bench. Default: 200. | [src/hippogriff.models.ts:67](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L67) |
| <a id="benchmaxsamples"></a> `benchMaxSamples?` | `number` | Max samples to take per bench. Default: 100. | [src/hippogriff.models.ts:64](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L64) |
| <a id="testtimeout"></a> `testTimeout?` | `number` | Timeout for tests in ms. Default: 2000. | [src/hippogriff.models.ts:61](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L61) |

***

### MainCallback()

Defined in: [src/hippogriff.ts:27](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L27)

```ts
MainCallback(
   title: string, 
   work?: WorkCallback, 
   settings?: ISettings): void;
```

Defined in: [src/hippogriff.ts:28](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `work?` | [`WorkCallback`](#workcallback) |
| `settings?` | [`ISettings`](#isettings) |

#### Returns

`void`

#### Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="only"></a> `only` | (`title`: `string`, `work`: [`WorkCallback`](#workcallback), `settings?`: [`ISettings`](#isettings)) => `void` | [src/hippogriff.ts:31](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L31) |
| <a id="skip"></a> `skip` | (`title`: `string`, `work`: [`WorkCallback`](#workcallback), `settings?`: [`ISettings`](#isettings)) => `void` | [src/hippogriff.ts:30](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L30) |

## Type Aliases

### WorkCallback()

```ts
type WorkCallback = () => Promise<void> | void;
```

Defined in: [src/hippogriff.models.ts:7](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.models.ts#L7)

#### Returns

`Promise`\<`void`\> \| `void`
