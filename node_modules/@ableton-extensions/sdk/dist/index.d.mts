//#region src/ExtensionHost.d.ts
/**
 * An opaque reference to a Live object, assigned by the Extension Host.
 *
 * Handles are received in various contexts — for example, when a command is invoked
 * it may carry a handle representing the object the action was triggered on. Use
 * {@link ExtensionContext.getObjectFromHandle} to resolve a handle into a typed SDK object.
 *
 * ```ts
 * commands.registerCommand("myAction", (...args) => {
 *   const handle = args[0] as Handle;
 *   const obj = context.getObjectFromHandle(handle, DataModelObject);
 *   if (obj instanceof ClipSlot) {
 *     // ...
 *   }
 * });
 * ```
 *
 * The `id` is an arbitrary number assigned by the host — never construct a Handle yourself.
 * Only handles received from the host are valid.
 */
interface Handle {
  id: bigint;
}
interface ArrangementSelection {
  time_selection_start: number;
  time_selection_end: number;
  selected_lanes: Handle[];
}
interface ClipSlotSelection {
  selected_clip_slots: Handle[];
}
interface WarpMarker {
  sampleTime: number;
  beatTime: number;
}
/**
 * The size of the arrangement grid. Used with {@link Song.gridIsTriplet} to determine
 * the full grid setting.
 */
declare enum GridQuantization {
  NoGrid = 0,
  EightBars = 1,
  FourBars = 2,
  TwoBars = 3,
  Bar = 4,
  Half = 5,
  Quarter = 6,
  Eighth = 7,
  Sixteenth = 8,
  ThirtySecond = 9
}
/** Warp algorithm for an audio clip. Corresponds to Live's Warp Mode chooser. */
declare enum WarpMode {
  Beats = 0,
  Tones = 1,
  Texture = 2,
  Repitch = 3,
  Complex = 4,
  ComplexPro = 6
}
/**
 * Initial region and loop settings for a new audio clip. These values become
 * {@link Clip.startMarker}, {@link Clip.endMarker}, {@link Clip.loopStart},
 * and {@link Clip.loopEnd} on the created clip.
 *
 * The API enforces:
 * - `startMarker ≤ endMarker`.
 * - The loop must be at least 0.25 beats (one 16th note) long.
 * - When `looping` is `false`: `loopStart === startMarker` and
 *   `loopEnd === endMarker`.
 * - When `isWarped` is `false`: positions must be non-negative and `looping`
 *   must be `false`.
 */
interface ClipLoopSettings {
  looping: boolean;
  /** In beats. */
  startMarker: number;
  /** In beats. */
  endMarker: number;
  /** In beats. */
  loopStart: number;
  /** In beats. */
  loopEnd: number;
}
interface DeviceParameterValueItem {
  name: string;
  shortName: string;
}
type NoteDescription = {
  pitch: number;
  startTime: number;
  duration: number;
  velocity?: number;
  muted?: boolean;
  probability?: number;
  velocityDeviation?: number;
  releaseVelocity?: number;
  selected?: boolean;
};
/** @internal */
interface CommandsModule_1_0_0 {
  registerCommand(commandId: string, callback: (...args: unknown[]) => void): void;
  executeCommand(commandId: string, ...args: unknown[]): void;
}
/** @internal */
interface DataModelModule_1_0_0 {
  getObjectIsOfClass: (handle: Handle, className: string) => boolean;
  getObjectCanonicalParent: (handle: Handle) => Handle | null;
  getRoot: () => Handle;
  rootGetSong: (handle: Handle) => Handle;
  songGetTempo: (handle: Handle) => number;
  songSetTempo: (handle: Handle, tempo: number) => void;
  songGetTracks: (handle: Handle) => Handle[];
  songGetReturnTracks: (handle: Handle) => Handle[];
  songGetMainTrack: (handle: Handle) => Handle;
  songGetGridQuantization: (handle: Handle) => GridQuantization;
  songGetGridIsTriplet: (handle: Handle) => boolean;
  songGetRootNote: (handle: Handle) => bigint;
  songGetScaleName: (handle: Handle) => string;
  songGetScaleMode: (handle: Handle) => boolean;
  songGetScaleIntervals: (handle: Handle) => bigint[];
  trackGetName: (handle: Handle) => string;
  trackSetName: (handle: Handle, value: string) => void;
  trackGetMute: (handle: Handle) => boolean;
  trackSetMute: (handle: Handle, value: boolean) => void;
  trackGetSolo: (handle: Handle) => boolean;
  trackSetSolo: (handle: Handle, value: boolean) => void;
  trackGetMutedViaSolo: (handle: Handle) => boolean;
  trackGetArm: (handle: Handle) => boolean;
  trackSetArm: (handle: Handle, value: boolean) => void;
  trackGetGroupTrack: (handle: Handle) => Handle | null;
  trackGetClipSlots: (handle: Handle) => Handle[];
  trackGetTakeLanes: (handle: Handle) => Handle[];
  trackGetArrangementClips: (handle: Handle) => Handle[];
  trackGetDevices: (handle: Handle) => Handle[];
  trackGetMixerDevice: (handle: Handle) => Handle;
  trackCreateTakeLane: (handle: Handle, onResult: (handle: Handle) => void, onError: () => void) => void;
  trackCreateMidiClip: (handle: Handle, startTime: number, duration: number, onResult: (handle: Handle) => void, onError: () => void) => void;
  trackCreateAudioClip: (handle: Handle, args: {
    filePath: string;
    startTime: number;
    duration: number | undefined;
    isWarped: boolean | undefined;
    loopSettings: ClipLoopSettings | undefined;
  }, onResult: (handle: Handle) => void, onError: () => void) => void;
  trackInsertDevice: (handle: Handle, deviceName: string, index: bigint, onResult: (handle: Handle) => void, onError: () => void) => void;
  trackDeleteDevice: (handle: Handle, deviceHandle: Handle, onResult: () => void, onError: () => void) => void;
  trackDuplicateDevice: (handle: Handle, deviceHandle: Handle, onResult: (handle: Handle) => void, onError: () => void) => void;
  trackDeleteClip: (handle: Handle, clipHandle: Handle, onResult: () => void, onError: () => void) => void;
  trackClearClipsInRange: (handle: Handle, startTime: number, endTime: number, onResult: () => void, onError: () => void) => void;
  withinTransaction<T>(fn: () => T): T;
  clipGetName: (handle: Handle) => string;
  clipSetName: (handle: Handle, value: string) => void;
  clipGetStartTime: (handle: Handle) => number;
  clipGetEndTime: (handle: Handle) => number;
  clipGetStartMarker: (handle: Handle) => number;
  clipGetEndMarker: (handle: Handle) => number;
  clipGetLooping: (handle: Handle) => boolean;
  clipSetLooping: (handle: Handle, value: boolean) => void;
  clipGetLoopStart: (handle: Handle) => number;
  clipGetLoopEnd: (handle: Handle) => number;
  clipGetColor: (handle: Handle) => number;
  clipSetColor: (handle: Handle, value: number) => void;
  clipGetMuted: (handle: Handle) => boolean;
  clipSetMuted: (handle: Handle, muted: boolean) => void;
  midiclipGetNotes: (handle: Handle) => NoteDescription[];
  midiclipSetNotes: (handle: Handle, notes: NoteDescription[]) => void;
  audioclipGetFilePath: (handle: Handle) => string;
  audioclipGetWarping: (handle: Handle) => boolean;
  audioclipSetWarping: (handle: Handle, value: boolean) => void;
  audioclipGetWarpMode: (handle: Handle) => WarpMode;
  audioclipSetWarpMode: (handle: Handle, warpMode: WarpMode) => void;
  audioclipGetWarpMarkers: (handle: Handle) => WarpMarker[];
  clipslotGetClip: (handle: Handle) => Handle | null;
  clipslotDeleteClip: (handle: Handle, onResult: () => void, onError: () => void) => void;
  clipslotCreateMidiClip: (handle: Handle, length: number, onResult: (handle: Handle) => void, onError: () => void) => void;
  clipslotCreateAudioClip: (handle: Handle, args: {
    filePath: string;
    isWarped: boolean | undefined;
    loopSettings: ClipLoopSettings | undefined;
  }, onResult: (handle: Handle) => void, onError: () => void) => void;
  takelaneGetClips: (handle: Handle) => Handle[];
  takelaneGetName: (handle: Handle) => string;
  takelaneSetName: (handle: Handle, value: string) => void;
  takelaneCreateMidiClip: (handle: Handle, startTime: number, duration: number, onResult: (handle: Handle) => void, onError: () => void) => void;
  takelaneCreateAudioClip: (handle: Handle, args: {
    filePath: string;
    startTime: number;
    duration: number | undefined;
    isWarped: boolean | undefined;
    loopSettings: ClipLoopSettings | undefined;
  }, onResult: (handle: Handle) => void, onError: () => void) => void;
  deviceGetName: (handle: Handle) => string;
  deviceGetParameters: (handle: Handle) => Handle[];
  sampleGetFilePath: (handle: Handle) => string;
  simplerGetSample: (handle: Handle) => Handle | null;
  simplerReplaceSample: (handle: Handle, filePath: string, onResult: (handle: Handle) => void, onError: () => void) => void;
  chainGetDevices: (handle: Handle) => Handle[];
  chainGetMixerDevice: (handle: Handle) => Handle;
  chainInsertDevice: (handle: Handle, deviceName: string, index: bigint, onResult: (handle: Handle) => void, onError: () => void) => void;
  chainDeleteDevice: (handle: Handle, deviceHandle: Handle, onResult: () => void, onError: () => void) => void;
  chainDuplicateDevice: (handle: Handle, deviceHandle: Handle, onResult: (handle: Handle) => void, onError: () => void) => void;
  rackdeviceGetChains: (handle: Handle) => Handle[];
  rackdeviceInsertChain: (handle: Handle, index: bigint, onResult: (handle: Handle) => void, onError: () => void) => void;
  drumchainGetReceivingNote: (handle: Handle) => bigint;
  drumchainSetReceivingNote: (handle: Handle, value: bigint) => void;
  songGetScenes: (handle: Handle) => Handle[];
  sceneGetName: (handle: Handle) => string;
  sceneSetName: (handle: Handle, value: string) => void;
  sceneGetTempo: (handle: Handle) => number;
  sceneGetSignatureNumerator: (handle: Handle) => number;
  sceneGetSignatureDenominator: (handle: Handle) => number;
  songGetCuePoints: (handle: Handle) => Handle[];
  songCreateScene: (handle: Handle, index: bigint, onResult: (handle: Handle) => void, onError: () => void) => void;
  songCreateMidiTrack: (handle: Handle, onResult: (handle: Handle) => void, onError: () => void) => void;
  songCreateAudioTrack: (handle: Handle, onResult: (handle: Handle) => void, onError: () => void) => void;
  songDeleteTrack: (handle: Handle, trackHandle: Handle, onResult: () => void, onError: () => void) => void;
  songDeleteScene: (handle: Handle, sceneHandle: Handle, onResult: () => void, onError: () => void) => void;
  songDuplicateTrack: (handle: Handle, trackHandle: Handle, onResult: (handle: Handle) => void, onError: () => void) => void;
  songDuplicateScene: (handle: Handle, sceneHandle: Handle, onResult: (handle: Handle) => void, onError: () => void) => void;
  songCreateCuePoint: (handle: Handle, time: number, onResult: (handle: Handle) => void, onError: () => void) => void;
  songDeleteCuePoint: (handle: Handle, cuePointHandle: Handle, onResult: () => void, onError: () => void) => void;
  cuePointGetTime: (handle: Handle) => number;
  cuePointGetName: (handle: Handle) => string;
  cuePointSetName: (handle: Handle, value: string) => void;
  deviceParameterGetName: (handle: Handle) => string;
  deviceParameterGetInternalMin: (handle: Handle) => number;
  deviceParameterGetInternalMax: (handle: Handle) => number;
  deviceParameterGetIsQuantized: (handle: Handle) => boolean;
  deviceParameterGetDefaultValue: (handle: Handle) => number;
  deviceParameterGetValueItems: (handle: Handle) => DeviceParameterValueItem[];
  deviceParameterGetInternalValue: (handle: Handle, onResult: (value: number) => void) => void;
  deviceParameterSetInternalValue: (handle: Handle, value: number, onResult: () => void, onError: (error: string) => void) => void;
  mixerdeviceGetVolume: (handle: Handle) => Handle;
  mixerdeviceGetPanning: (handle: Handle) => Handle;
  mixerdeviceGetSends: (handle: Handle) => Handle[];
  chainmixerdeviceGetVolume: (handle: Handle) => Handle;
  chainmixerdeviceGetPanning: (handle: Handle) => Handle;
  chainmixerdeviceGetSends: (handle: Handle) => Handle[];
}
/** @internal */
interface UiModule_1_0_0 {
  registerContextMenuAction(scope: ContextMenuScope<"1.0.0">, title: string, commandId: string, onRegisterSuccessful: (unregisterAction: (onUnregisterSuccessful: () => void) => void) => void): void;
  showModalDialog(url: string, width: number, height: number, onResult: (content: string) => void, onError: () => void): void;
  showProgressDialog(options: {
    text: string;
    progress?: number;
  }, onShowDialog: (dialog: {
    update(options: {
      text: string;
      progress?: number;
    }, onUpdated?: () => void): void;
    close(onClosed?: () => void): void;
  }) => void, onCancelled: () => void): void;
}
/** @internal */
interface EnvironmentModule_1_0_0 {
  storageDirectory?: string;
  tempDirectory?: string;
  language?: string;
}
/** @internal */
interface ResourcesModule_1_0_0 {
  renderPreFxAudio(lane: Handle, args: {
    startTime: number;
    endTime: number;
  }, onResult: (path: string) => void, onError: () => void): void;
  importIntoProject(filePath: string, onResult: (importedPath: string) => void, onError: (error: string) => void): void;
}
/** @internal */
interface ExtensionsApi_1_0_0 {
  commands: CommandsModule_1_0_0;
  dataModel: DataModelModule_1_0_0;
  environment: EnvironmentModule_1_0_0;
  resources: ResourcesModule_1_0_0;
  ui: UiModule_1_0_0;
}
/** @internal */
type EXTENSIONS_API = {
  "1.0.0": ExtensionsApi_1_0_0;
};
/** @internal */
type EXTENSIONS_API_VERSIONS = ["1.0.0"];
/** All API versions supported by this SDK release, newest first. */
declare const EXTENSIONS_API_VERSIONS: EXTENSIONS_API_VERSIONS;
/** @internal */
type ApiVersion = keyof EXTENSIONS_API;
/** @internal */
type CommandsModule<V extends ApiVersion> = EXTENSIONS_API[V]["commands"];
type DataModelModule<V extends ApiVersion> = EXTENSIONS_API[V]["dataModel"];
type EnvironmentModule<V extends ApiVersion> = EXTENSIONS_API[V]["environment"];
type ResourcesModule<V extends ApiVersion> = EXTENSIONS_API[V]["resources"];
type UiModule<V extends ApiVersion> = EXTENSIONS_API[V]["ui"];
/**
 * The scope in which a context menu action is shown.
 *
 * Scopes that pass the triggered object's {@link Handle} as the first command argument:
 * `"AudioClip"`, `"AudioTrack"`, `"ClipSlot"`, `"DrumRack"`, `"MidiClip"`,`"MidiTrack"`,
 * `"Sample"`, `"Scene"`, `"Simpler"`.
 *
 * Scopes that pass a selection context as the first command argument:
 * `"ClipSlotSelection"` ({@link ClipSlotSelection}),
 * `"AudioTrack.ArrangementSelection"` and `"MidiTrack.ArrangementSelection"` ({@link ArrangementSelection}).
 */
type ContextMenuScope<V extends ApiVersion> = V extends "1.0.0" ? "AudioClip" | "AudioTrack" | "ClipSlot" | "DrumRack" | "MidiClip" | "MidiTrack" | "Sample" | "Scene" | "Simpler" | "ClipSlotSelection" | "AudioTrack.ArrangementSelection" | "MidiTrack.ArrangementSelection" : never;
/** @internal */
interface InitializeOptions<V extends ApiVersion> {
  apiVersion: V;
}
/**
 * The context passed to your extension's `activate` function. Pass it to {@link initialize} to set up the SDK.
 */
interface ActivationContext {
  /** The latest API version the Extension Host supports. */
  hostApiVersion: string;
  /** @internal */
  initializeExtensionHost<V extends ApiVersion>(options: InitializeOptions<V>): EXTENSIONS_API[V];
}
//#endregion
//#region src/DataModelObjectRegistry.d.ts
/**
 * Resolves {@link Handle}s into typed SDK objects.
 *
 * Objects are cached by handle ID, so the same Live object always returns the same SDK instance.
 */
declare class DataModelObjectRegistry<Version extends ApiVersion> {
  private cache;
  private dataModel;
  /** @internal */
  constructor(dataModel: DataModelModule<Version>);
  private getOrCreateObjectFromHandle;
  /**
   * Resolves a {@link Handle} into a typed SDK object.
   *
   * Pass {@link DataModelObject} as `type` when the exact type of the handle is not known
   * in advance, then use `instanceof` to branch on the actual type:
   *
   * ```ts
   * const obj = objects.getObjectFromHandle(handle, DataModelObject);
   * if (obj instanceof ClipSlot) {
   *   // ...
   * }
   * ```
   *
   * Throws if the underlying object has been deleted, if it is of a different
   * type than `type`, or if its type is not recognised.
   *
   * @param handle - The handle to resolve.
   * @param type - The expected SDK class (e.g. `ClipSlot`).
   */
  getObjectFromHandle<T extends DataModelObject<Version>>(handle: Handle, type: abstract new (...args: never) => T): T;
}
//#endregion
//#region src/DataModelObject.d.ts
/**
 * Base class for all SDK objects.
 *
 * When the exact type of a received handle is not known in advance, pass `DataModelObject`
 * as the `type` argument to {@link ExtensionContext.getObjectFromHandle} — see that
 * method for details.
 */
declare class DataModelObject<Version extends ApiVersion> {
  readonly handle: Handle;
  protected readonly dataModel: DataModelModule<Version>;
  protected readonly objectRegistry: DataModelObjectRegistry<Version>;
  /** @internal */
  constructor(handle: Handle, dataModel: DataModelModule<Version>, objectRegistry: DataModelObjectRegistry<Version>);
  /** The canonical parent of this object in Live's object hierarchy, or `null` if it has none. */
  get parent(): DataModelObject<Version> | null;
}
//#endregion
//#region src/Clip.d.ts
/** Represents a clip. */
declare class Clip<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className: string;
  get name(): string;
  set name(name: string);
  get startTime(): number;
  get endTime(): number;
  get duration(): number;
  get startMarker(): number;
  get endMarker(): number;
  /**
   * Whether the clip is looped. Enabling looping on an unwarped audio clip
   * automatically enables warping.
   */
  get looping(): boolean;
  set looping(value: boolean);
  get loopStart(): number;
  get loopEnd(): number;
  get color(): number;
  set color(value: number);
  get muted(): boolean;
  set muted(value: boolean);
}
//#endregion
//#region src/AudioClip.d.ts
/** Represents an audio clip. */
declare class AudioClip<Version extends ApiVersion> extends Clip<Version> {
  static readonly className = "AudioClip";
  get filePath(): string;
  get warping(): boolean;
  set warping(value: boolean);
  get warpMode(): WarpMode;
  set warpMode(warpMode: WarpMode);
  get warpMarkers(): WarpMarker[];
}
//#endregion
//#region src/MidiClip.d.ts
/** Represents a MIDI clip. */
declare class MidiClip<Version extends ApiVersion> extends Clip<Version> {
  static readonly className = "MidiClip";
  get notes(): NoteDescription[];
  set notes(notes: NoteDescription[]);
}
//#endregion
//#region src/ClipSlot.d.ts
/** A slot in the Session View grid that can hold a clip. */
declare class ClipSlot<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "ClipSlot";
  get clip(): Clip<Version> | null;
  /**
   * Deletes the clip in this slot. Await the returned promise to ensure the
   * deletion has been fully processed.
   */
  deleteClip(): Promise<void>;
  /** @param length - Length of the clip in beats. */
  createMidiClip(length: number): Promise<MidiClip<Version>>;
  /**
   * Creates an audio clip in this session slot.
   *
   * @param args.filePath - Absolute path to the audio file.
   * @param args.isWarped - See {@link AudioTrack.createAudioClip}.
   * @param args.loopSettings - See {@link AudioTrack.createAudioClip}.
   */
  createAudioClip(args: {
    filePath: string;
    isWarped?: boolean;
    loopSettings?: ClipLoopSettings;
  }): Promise<AudioClip<Version>>;
}
//#endregion
//#region src/DeviceParameter.d.ts
/** Represents a device parameter. */
declare class DeviceParameter<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "DeviceParameter";
  get name(): string;
  get min(): number;
  get max(): number;
  get isQuantized(): boolean;
  get defaultValue(): number;
  get valueItems(): DeviceParameterValueItem[];
  getValue(): Promise<number>;
  setValue(value: number): Promise<void>;
}
//#endregion
//#region src/Device.d.ts
/** Represents a device. */
declare class Device<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className: string;
  get name(): string;
  get parameters(): DeviceParameter<Version>[];
}
//#endregion
//#region src/TakeLane.d.ts
/** Represents a take lane. */
declare class TakeLane<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "TakeLane";
  get clips(): Clip<Version>[];
  get name(): string;
  set name(value: string);
  /**
   * @param startTime - Position in the arrangement in beats.
   * @param duration - Length of the clip in beats.
   */
  createMidiClip(startTime: number, duration: number): Promise<MidiClip<Version>>;
  /**
   * Creates an audio clip on this take lane. See {@link AudioTrack.createAudioClip}
   * for argument semantics.
   */
  createAudioClip(args: {
    filePath: string;
    startTime: number;
    duration?: number;
    isWarped?: boolean;
    loopSettings?: ClipLoopSettings;
  }): Promise<AudioClip<Version>>;
}
//#endregion
//#region src/TrackMixer.d.ts
/** Represents the mixer of a track. */
declare class TrackMixer<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "MixerDevice";
  get volume(): DeviceParameter<Version>;
  get panning(): DeviceParameter<Version>;
  get sends(): DeviceParameter<Version>[];
}
//#endregion
//#region src/Track.d.ts
/** Represents a track. */
declare class Track<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className: string;
  get name(): string;
  set name(value: string);
  get mute(): boolean;
  set mute(value: boolean);
  get solo(): boolean;
  set solo(value: boolean);
  get mutedViaSolo(): boolean;
  get arm(): boolean;
  set arm(value: boolean);
  get clipSlots(): ClipSlot<Version>[];
  get takeLanes(): TakeLane<Version>[];
  get arrangementClips(): Clip<Version>[];
  get groupTrack(): Track<Version> | null;
  get devices(): Device<Version>[];
  get mixer(): TrackMixer<Version>;
  /** Appended to the end of {@link takeLanes}. */
  createTakeLane(): Promise<TakeLane<Version>>;
  /**
   * Inserts a built-in Live device with its default preset into the track's device chain.
   * Only devices native to Live are supported — third-party plug-ins cannot be loaded this way.
   *
   * @param deviceName - The name of the built-in Live device (e.g. `"Reverb"`, `"Auto Filter"`).
   * @param index - Zero-based position in the device chain at which to insert.
   */
  insertDevice(deviceName: string, index: number): Promise<Device<Version>>;
  /**
   * Deletes a device from this track's device chain. Await the returned
   * promise to ensure the deletion has been fully processed.
   */
  deleteDevice(device: Device<Version>): Promise<void>;
  /** The duplicate is inserted directly after the original in the device chain. */
  duplicateDevice(device: Device<Version>): Promise<Device<Version>>;
  /**
   * Deletes an arrangement clip. For session clips, use {@link ClipSlot.deleteClip}.
   * Await the returned promise to ensure the deletion has been fully processed.
   */
  deleteClip(clip: Clip<Version>): Promise<void>;
  /**
   * Deletes clips within the range. Clips that overlap a boundary are truncated
   * to the range edge rather than fully deleted.
   *
   * @param startTime - Start of the range in beats.
   * @param endTime - End of the range in beats.
   */
  clearClipsInRange(startTime: number, endTime: number): Promise<void>;
}
//#endregion
//#region src/AudioTrack.d.ts
/** Represents an audio track. */
declare class AudioTrack<Version extends ApiVersion> extends Track<Version> {
  static readonly className = "AudioTrack";
  /**
   * Creates an audio clip from a file in the track's arrangement timeline.
   *
   * @param args.filePath - Absolute path to the audio file.
   * @param args.startTime - Position in the arrangement timeline in beats.
   * @param args.duration - Length of the clip on the arrangement timeline,
   *   in beats. Capped at the sample's natural length for non-looping clips;
   *   looping clips repeat to fill the full length. Defaults to the sample's
   *   natural length at the current tempo when omitted.
   * @param args.isWarped - Whether warping is enabled. Defaults to the clip's
   *   saved `.asd` settings if present, otherwise Live's "Auto-Warp" preference.
   *   Must be provided when `loopSettings` is provided.
   * @param args.loopSettings - Initial loop settings. Requires `isWarped` to be
   *   defined. If `isWarped` is `false`, `loopSettings.looping` must be `false`.
   *
   * @example
   * const clip = await track.createAudioClip({ filePath: '/samples/kick.wav', startTime: 0 });
   *
   * @example
   * const clip = await track.createAudioClip({
   *   filePath: '/samples/ambient.wav',
   *   startTime: 16,
   *   isWarped: false,
   * });
   *
   * @example
   * // Clip view: Start=beat 0, End=beat 2, Loop position=beat 0, Loop length=1 beat.
   * const clip = await track.createAudioClip({
   *   filePath: '/samples/loop.wav',
   *   startTime: 0,
   *   isWarped: true,
   *   loopSettings: { looping: true, startMarker: 0, endMarker: 2, loopStart: 0, loopEnd: 1 },
   * });
   *
   * @example
   * const clip = await track.createAudioClip({
   *   filePath: '/samples/loop.wav',
   *   startTime: 0,
   *   isWarped: true,
   *   duration: 8,
   *   loopSettings: { looping: true, startMarker: 0, endMarker: 2, loopStart: 0, loopEnd: 2 },
   * });
   */
  createAudioClip(args: {
    filePath: string;
    startTime: number;
    duration?: number;
    isWarped?: boolean;
    loopSettings?: ClipLoopSettings;
  }): Promise<AudioClip<Version>>;
}
//#endregion
//#region src/CuePoint.d.ts
/** Represents a cue point. */
declare class CuePoint<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "CuePoint";
  get time(): number;
  get name(): string;
  set name(value: string);
}
//#endregion
//#region src/MidiTrack.d.ts
/** Represents a MIDI track. */
declare class MidiTrack<Version extends ApiVersion> extends Track<Version> {
  static readonly className = "MidiTrack";
  /**
   * @param startTime - Position in the arrangement in beats.
   * @param duration - Length of the clip in beats.
   */
  createMidiClip(startTime: number, duration: number): Promise<MidiClip<Version>>;
}
//#endregion
//#region src/Scene.d.ts
/** Represents a scene. */
declare class Scene<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "Scene";
  get name(): string;
  set name(value: string);
  get tempo(): number;
  get signatureNumerator(): number;
  get signatureDenominator(): number;
}
//#endregion
//#region src/Song.d.ts
/** Represents the current Live Set. */
declare class Song<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "Song";
  /** Regular tracks only — excludes return tracks and the main track. */
  get tracks(): Track<Version>[];
  get returnTracks(): Track<Version>[];
  get mainTrack(): Track<Version>;
  get scenes(): Scene<Version>[];
  get cuePoints(): CuePoint<Version>[];
  get tempo(): number;
  set tempo(value: number);
  /**
   * The current arrangement grid quantization. Use with {@link gridIsTriplet} to
   * determine the full grid setting.
   */
  get gridQuantization(): GridQuantization;
  /**
   * Whether the arrangement grid uses triplet subdivisions of the current
   * {@link gridQuantization} value.
   */
  get gridIsTriplet(): boolean;
  /**
   * The root note of the scale currently selected in Live, as a MIDI note number
   * from 0 (C) to 11 (B).
   */
  get rootNote(): number;
  /** The name of the scale selected in Live, as shown in the Current Scale Name chooser. */
  get scaleName(): string;
  /** Whether Live's Scale Mode is enabled. */
  get scaleMode(): boolean;
  /** The intervals of the current scale as semitone offsets from the root note. */
  get scaleIntervals(): number[];
  /** Inserted after the last selected track, or appended if no track is selected. */
  createAudioTrack(): Promise<AudioTrack<Version>>;
  /** Inserted after the last selected track, or appended if no track is selected. */
  createMidiTrack(): Promise<MidiTrack<Version>>;
  /**
   * @param index - 0-based insert position in the range `[0, song.scenes.length]`.
   * Pass `-1` to append at the end.
   */
  createScene(index: number): Promise<Scene<Version>>;
  /**
   * Deletes a track from the song. Await the returned promise to ensure the
   * deletion has been fully processed.
   */
  deleteTrack(track: Track<Version>): Promise<void>;
  /**
   * Deletes a scene from the song. Await the returned promise to ensure the
   * deletion has been fully processed.
   */
  deleteScene(scene: Scene<Version>): Promise<void>;
  /** Duplicates the track. The duplicate is inserted immediately after the original. */
  duplicateTrack(track: Track<Version>): Promise<Track<Version>>;
  /** Duplicates the scene. The duplicate is inserted immediately after the original. */
  duplicateScene(scene: Scene<Version>): Promise<Scene<Version>>;
  /** @param time - Position in the arrangement in beats. */
  createCuePoint(time: number): Promise<CuePoint<Version>>;
  /**
   * Deletes a cue point from the song. Await the returned promise to ensure
   * the deletion has been fully processed.
   */
  deleteCuePoint(cuePoint: CuePoint<Version>): Promise<void>;
}
//#endregion
//#region src/Application.d.ts
/** Represents the application. */
declare class Application<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "Application";
  get song(): Song<Version>;
}
//#endregion
//#region src/Commands.d.ts
/**
 * Registry for extension commands.
 *
 * Commands are identified by a string ID and can be invoked by Live (e.g. through a
 * context menu action registered via {@link ExtensionContext.ui}) or programmatically
 * via {@link Commands.executeCommand}.
 */
declare class Commands<Version extends ApiVersion> {
  private module;
  /** @internal */
  constructor(module: CommandsModule<Version>);
  /**
   * Registers a command that can be invoked by Live or via {@link Commands.executeCommand}.
   *
   * @param commandId - A unique string identifier for this command.
   * @param callback - Called when the command is invoked. May receive arguments passed by the invoker.
   */
  registerCommand(commandId: string, callback: (...args: unknown[]) => void): void;
  /**
   * Programmatically invokes a registered command.
   *
   * @param commandId - The ID of the command to invoke.
   * @param args - Arguments to pass to the command's callback.
   */
  executeCommand(commandId: string, ...args: unknown[]): void;
}
//#endregion
//#region src/Environment.d.ts
/** Provides runtime environment information: filesystem paths and the current locale. */
declare class Environment<Version extends ApiVersion> {
  private module;
  /** @internal */
  constructor(module: EnvironmentModule<Version>);
  /**
   * Per-extension directory for persistent storage. Use it for configuration, credentials,
   * and cached state — anything that should survive across Live sessions.
   */
  get storageDirectory(): string | undefined;
  /**
   * Per-extension directory for temporary files, such as intermediate audio or analysis
   * results. May be cleaned up between sessions.
   */
  get tempDirectory(): string | undefined;
  /** Live's current UI language as an uppercase ISO 639-1 code (e.g. `"EN"`, `"DE"`, `"JA"`). */
  get language(): string | undefined;
}
//#endregion
//#region src/Resources.d.ts
/** Service for importing files into the Live project and rendering audio from the arrangement. */
declare class Resources<Version extends ApiVersion> {
  private module;
  /** @internal */
  constructor(module: ResourcesModule<Version>);
  /**
   * Renders the pre-effects audio of a track in the arrangement between two beat
   * positions. Returns a path to a WAV file written to the extension's temp directory.
   */
  renderPreFxAudio(track: AudioTrack<Version>, /** In beats. */

  startTime: number, /** In beats. */

  endTime: number): Promise<string>;
  /**
   * Copies a file into the Live project folder so that Live manages it.
   * Returns the path to the imported copy. Use the returned path in subsequent API
   * calls, not the original.
   */
  importIntoProject(filePath: string): Promise<string>;
}
//#endregion
//#region src/Ui.d.ts
/** Service for UI interactions: context menus, modal dialogs, and progress dialogs. */
declare class Ui<Version extends ApiVersion> {
  private module;
  /** @internal */
  constructor(module: UiModule<Version>);
  /**
   * Registers a context menu action in the given {@link ContextMenuScope}.
   *
   * When the user triggers the action, Live invokes the command identified by
   * `commandId`. Depending on the scope, the command receives either the triggered
   * object's {@link Handle}, an {@link ArrangementSelection}, or a
   * {@link ClipSlotSelection} as its first argument.
   *
   * Returns a function that unregisters the action when called.
   */
  registerContextMenuAction(scope: ContextMenuScope<Version>, title: string, commandId: string): Promise<() => Promise<void>>;
  /**
   * Opens a modal dialog that loads the given URL. Supported URL schemes are
   * `file:`, `data:`, `https:`, and `http://localhost`.
   *
   * To return a result and close the dialog, the dialog's HTML must post the message
   * `{ method: "close_and_send", params: [resultString] }` to the host's message
   * handler — `window.webkit.messageHandlers.live.postMessage` on macOS or
   * `window.chrome.webview.postMessage` on Windows. The returned promise resolves
   * with that string.
   *
   * Rejects if `url` is malformed or an unexpected error occurred.
   */
  showModalDialog(url: string, width: number, height: number): Promise<string>;
  /**
   * Shows a progress dialog while `callback` runs.
   * The callback receives an `update` function to change the text/progress
   * (progress is a percentage, 0–100), and an `AbortSignal` that fires if
   * the user cancels the dialog.
   * The dialog closes automatically when the callback resolves or rejects.
   *
   * @example
   * ```ts
   * const wavPath = await ui.withinProgressDialog(
   *   "Rendering audio…",
   *   { progress: 0 },
   *   async (update, signal) => {
   *     await update("Analysing…", 30);
   *     if (signal.aborted) return;
   *     await update("Rendering…", 70);
   *     return await resources.renderPreFxAudio(track, startBeat, endBeat);
   *   },
   * );
   * ```
   */
  withinProgressDialog(text: string, options: {
    progress?: number;
  }, callback: (update: (updateText: string, progress?: number) => Promise<void>, abortSignal: AbortSignal) => Promise<unknown>): Promise<unknown>;
}
//#endregion
//#region src/Initialize.d.ts
/**
 * Provides access to all SDK functionality. Returned by {@link initialize}.
 */
interface ExtensionContext<Version extends ApiVersion> {
  application: Application<Version>;
  commands: Commands<Version>;
  environment: Environment<Version>;
  resources: Resources<Version>;
  ui: Ui<Version>;
  /**
   * Resolves a {@link Handle} into a typed SDK object.
   *
   * Pass {@link DataModelObject} as `type` when the exact type of the handle is not known
   * in advance, then use `instanceof` to branch on the actual type:
   *
   * ```ts
   * const obj = context.getObjectFromHandle(handle, DataModelObject);
   * if (obj instanceof ClipSlot) {
   *   // ...
   * }
   * ```
   *
   * Objects are cached by handle ID, so the same Live object always returns the same
   * SDK instance.
   *
   * Throws if the underlying object has been deleted, if it is of a different type
   * than `type`, or if its type is not recognised.
   */
  getObjectFromHandle<T extends DataModelObject<Version>>(handle: Handle, type: abstract new (...args: never) => T): T;
  /**
   * Groups mutations into a single undo step.
   *
   * Individual mutations are already undoable on their own; use this only to
   * roll several changes into one user-facing undo entry. Nested transactions
   * collapse into the outermost one.
   *
   * The callback must be synchronous — you cannot `await` inside it — but
   * returning `Promise.all([...])` lets you group multiple async operations
   * (such as creating tracks) into one undo step:
   *
   * ```ts
   * const tracks = await withinTransaction(() =>
   *   Promise.all([song.createAudioTrack(), song.createAudioTrack()]),
   * );
   * ```
   */
  withinTransaction<T>(fn: () => T): T;
}
/**
 * Initializes the SDK with the Extension Host and returns the API context.
 *
 * Pass the lowest API version that covers all the features your extension needs.
 * The Extension Host preserves older API versions as Live evolves, so targeting an
 * older version keeps your extension compatible with a wider range of Live releases.
 * Available versions are listed in {@link EXTENSIONS_API_VERSIONS}.
 *
 * Throws if the Extension Host does not support the requested API version.
 *
 * @param context - The activation context passed to your extension's `activate` function.
 * @param apiVersion - The API version your extension targets (e.g. `"1.0.0"`).
 * @returns An {@link ExtensionContext} providing access to Live's object model, commands, and UI.
 */
declare const initialize: <V extends ApiVersion>(context: ActivationContext, apiVersion: V) => ExtensionContext<V>;
//#endregion
//#region src/ChainMixer.d.ts
/** Represents the mixer of a device chain. */
declare class ChainMixer<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "ChainMixerDevice";
  get volume(): DeviceParameter<Version>;
  get panning(): DeviceParameter<Version>;
  get sends(): DeviceParameter<Version>[];
}
//#endregion
//#region src/Chain.d.ts
/** Represents a device chain. */
declare class Chain<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className: string;
  get devices(): Device<Version>[];
  get mixer(): ChainMixer<Version>;
  /**
   * Inserts a built-in Live device with its default preset into the chain.
   * Only devices native to Live are supported — third-party plug-ins cannot be loaded this way.
   *
   * @param deviceName - The name of the built-in Live device (e.g. `"Reverb"`, `"Auto Filter"`).
   * @param index - Zero-based position in the device chain at which to insert.
   */
  insertDevice(deviceName: string, index: number): Promise<Device<Version>>;
  /**
   * Deletes a device from this chain. Await the returned promise to ensure
   * the deletion has been fully processed.
   */
  deleteDevice(device: Device<Version>): Promise<void>;
  /** The duplicate is inserted directly after the original in the device chain. */
  duplicateDevice(device: Device<Version>): Promise<Device<Version>>;
}
//#endregion
//#region src/DrumChain.d.ts
/** Represents a drum chain. */
declare class DrumChain<Version extends ApiVersion> extends Chain<Version> {
  static readonly className = "DrumChain";
  get receivingNote(): number;
  set receivingNote(value: number);
}
//#endregion
//#region src/RackDevice.d.ts
/** Represents a rack device. */
declare class RackDevice<Version extends ApiVersion> extends Device<Version> {
  static readonly className: string;
  get chains(): Chain<Version>[];
  /** @param index - 0-based insert position in the range `[0, rack.chains.length]`. */
  insertChain(index: number): Promise<Chain<Version>>;
}
//#endregion
//#region src/DrumRack.d.ts
/** Represents a Drum Rack device. */
declare class DrumRack<Version extends ApiVersion> extends RackDevice<Version> {
  static readonly className = "DrumRackDevice";
  get chains(): DrumChain<Version>[];
}
//#endregion
//#region src/Sample.d.ts
/** Represents a sample. */
declare class Sample<Version extends ApiVersion> extends DataModelObject<Version> {
  static readonly className = "Sample";
  get filePath(): string;
}
//#endregion
//#region src/Simpler.d.ts
/** Represents a Simpler device. */
declare class Simpler<Version extends ApiVersion> extends Device<Version> {
  static readonly className = "Simpler";
  get sample(): Sample<Version> | null;
  /** Replaces the loaded sample with the audio file at the given absolute path. */
  replaceSample(filePath: string): Promise<Sample<Version>>;
}
//#endregion
export { type ActivationContext, type ApiVersion, Application, type ArrangementSelection, AudioClip, AudioTrack, Chain, ChainMixer, Clip, type ClipLoopSettings, ClipSlot, type ClipSlotSelection, Commands, type ContextMenuScope, CuePoint, DataModelObject, Device, DeviceParameter, type DeviceParameterValueItem, DrumChain, DrumRack, type EXTENSIONS_API, EXTENSIONS_API_VERSIONS, Environment, type ExtensionContext, GridQuantization, type Handle, type InitializeOptions, MidiClip, MidiTrack, type NoteDescription, RackDevice, Resources, Sample, Scene, Simpler, Song, TakeLane, Track, TrackMixer, Ui, type WarpMarker, WarpMode, initialize };
//# sourceMappingURL=index.d.mts.map