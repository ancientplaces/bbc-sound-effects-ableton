"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(extension_exports);
var fs = __toESM(require("fs/promises"), 1);
var path = __toESM(require("path"), 1);
var https = __toESM(require("https"), 1);
var os = __toESM(require("os"), 1);
var import_fs = require("fs");

// node_modules/@ableton-extensions/sdk/dist/index.mjs
var DataModelObject = class DataModelObject2 {
  /** @internal */
  constructor(handle, dataModel, objectRegistry) {
    this.handle = handle;
    this.dataModel = dataModel;
    this.objectRegistry = objectRegistry;
  }
  /** The canonical parent of this object in Live's object hierarchy, or `null` if it has none. */
  get parent() {
    const handle = this.dataModel.getObjectCanonicalParent(this.handle);
    return handle ? this.objectRegistry.getObjectFromHandle(handle, DataModelObject2) : null;
  }
};
var invokeAsync = (dataModel, fn, ...args) => new Promise((resolve, reject) => {
  dataModel.withinTransaction(() => fn(...args, resolve, reject));
});
var createAsync = (dataModel, registry, type, fn, ...args) => new Promise((resolve, reject) => {
  dataModel.withinTransaction(() => fn(...args, (handle) => resolve(registry.getObjectFromHandle(handle, type)), reject));
});
var Clip = class extends DataModelObject {
  static className = "Clip";
  get name() {
    return this.dataModel.clipGetName(this.handle);
  }
  set name(name) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.clipSetName(this.handle, name);
    });
  }
  get startTime() {
    return this.dataModel.clipGetStartTime(this.handle);
  }
  get endTime() {
    return this.dataModel.clipGetEndTime(this.handle);
  }
  get duration() {
    return this.dataModel.clipGetEndTime(this.handle) - this.dataModel.clipGetStartTime(this.handle);
  }
  get startMarker() {
    return this.dataModel.clipGetStartMarker(this.handle);
  }
  get endMarker() {
    return this.dataModel.clipGetEndMarker(this.handle);
  }
  /**
  * Whether the clip is looped. Enabling looping on an unwarped audio clip
  * automatically enables warping.
  */
  get looping() {
    return this.dataModel.clipGetLooping(this.handle);
  }
  set looping(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.clipSetLooping(this.handle, value);
    });
  }
  get loopStart() {
    return this.dataModel.clipGetLoopStart(this.handle);
  }
  get loopEnd() {
    return this.dataModel.clipGetLoopEnd(this.handle);
  }
  get color() {
    return this.dataModel.clipGetColor(this.handle);
  }
  set color(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.clipSetColor(this.handle, value);
    });
  }
  get muted() {
    return this.dataModel.clipGetMuted(this.handle);
  }
  set muted(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.clipSetMuted(this.handle, value);
    });
  }
};
var AudioClip = class extends Clip {
  static className = "AudioClip";
  get filePath() {
    return this.dataModel.audioclipGetFilePath(this.handle);
  }
  get warping() {
    return this.dataModel.audioclipGetWarping(this.handle);
  }
  set warping(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.audioclipSetWarping(this.handle, value);
    });
  }
  get warpMode() {
    return this.dataModel.audioclipGetWarpMode(this.handle);
  }
  set warpMode(warpMode) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.audioclipSetWarpMode(this.handle, warpMode);
    });
  }
  get warpMarkers() {
    return this.dataModel.audioclipGetWarpMarkers(this.handle);
  }
};
var MidiClip = class extends Clip {
  static className = "MidiClip";
  get notes() {
    return this.dataModel.midiclipGetNotes(this.handle);
  }
  set notes(notes) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.midiclipSetNotes(this.handle, notes);
    });
  }
};
var ClipSlot = class extends DataModelObject {
  static className = "ClipSlot";
  get clip() {
    const handle = this.dataModel.clipslotGetClip(this.handle);
    return handle ? this.objectRegistry.getObjectFromHandle(handle, Clip) : null;
  }
  /**
  * Deletes the clip in this slot. Await the returned promise to ensure the
  * deletion has been fully processed.
  */
  deleteClip() {
    return invokeAsync(this.dataModel, this.dataModel.clipslotDeleteClip, this.handle);
  }
  /** @param length - Length of the clip in beats. */
  createMidiClip(length) {
    return createAsync(this.dataModel, this.objectRegistry, MidiClip, this.dataModel.clipslotCreateMidiClip, this.handle, length);
  }
  /**
  * Creates an audio clip in this session slot.
  *
  * @param args.filePath - Absolute path to the audio file.
  * @param args.isWarped - See {@link AudioTrack.createAudioClip}.
  * @param args.loopSettings - See {@link AudioTrack.createAudioClip}.
  */
  createAudioClip(args) {
    return createAsync(this.dataModel, this.objectRegistry, AudioClip, this.dataModel.clipslotCreateAudioClip, this.handle, {
      filePath: args.filePath,
      isWarped: args.isWarped,
      loopSettings: args.loopSettings
    });
  }
};
var DeviceParameter = class extends DataModelObject {
  static className = "DeviceParameter";
  get name() {
    return this.dataModel.deviceParameterGetName(this.handle);
  }
  get min() {
    return this.dataModel.deviceParameterGetInternalMin(this.handle);
  }
  get max() {
    return this.dataModel.deviceParameterGetInternalMax(this.handle);
  }
  get isQuantized() {
    return this.dataModel.deviceParameterGetIsQuantized(this.handle);
  }
  get defaultValue() {
    return this.dataModel.deviceParameterGetDefaultValue(this.handle);
  }
  get valueItems() {
    return this.dataModel.deviceParameterGetValueItems(this.handle);
  }
  getValue() {
    return new Promise((resolve) => {
      this.dataModel.deviceParameterGetInternalValue(this.handle, resolve);
    });
  }
  setValue(value) {
    return new Promise((resolve, reject) => {
      this.dataModel.withinTransaction(() => {
        this.dataModel.deviceParameterSetInternalValue(this.handle, value, resolve, (error) => reject(new Error(error)));
      });
    });
  }
};
var Device = class extends DataModelObject {
  static className = "Device";
  get name() {
    return this.dataModel.deviceGetName(this.handle);
  }
  get parameters() {
    return this.dataModel.deviceGetParameters(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, DeviceParameter));
  }
};
var TakeLane = class extends DataModelObject {
  static className = "TakeLane";
  get clips() {
    return this.dataModel.takelaneGetClips(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Clip));
  }
  get name() {
    return this.dataModel.takelaneGetName(this.handle);
  }
  set name(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.takelaneSetName(this.handle, value);
    });
  }
  /**
  * @param startTime - Position in the arrangement in beats.
  * @param duration - Length of the clip in beats.
  */
  createMidiClip(startTime, duration) {
    return createAsync(this.dataModel, this.objectRegistry, MidiClip, this.dataModel.takelaneCreateMidiClip, this.handle, startTime, duration);
  }
  /**
  * Creates an audio clip on this take lane. See {@link AudioTrack.createAudioClip}
  * for argument semantics.
  */
  createAudioClip(args) {
    return createAsync(this.dataModel, this.objectRegistry, AudioClip, this.dataModel.takelaneCreateAudioClip, this.handle, {
      duration: args.duration,
      filePath: args.filePath,
      isWarped: args.isWarped,
      loopSettings: args.loopSettings,
      startTime: args.startTime
    });
  }
};
var TrackMixer = class extends DataModelObject {
  static className = "MixerDevice";
  get volume() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.mixerdeviceGetVolume(this.handle), DeviceParameter);
  }
  get panning() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.mixerdeviceGetPanning(this.handle), DeviceParameter);
  }
  get sends() {
    return this.dataModel.mixerdeviceGetSends(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, DeviceParameter));
  }
};
var Track = class Track2 extends DataModelObject {
  static className = "Track";
  get name() {
    return this.dataModel.trackGetName(this.handle);
  }
  set name(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.trackSetName(this.handle, value);
    });
  }
  get mute() {
    return this.dataModel.trackGetMute(this.handle);
  }
  set mute(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.trackSetMute(this.handle, value);
    });
  }
  get solo() {
    return this.dataModel.trackGetSolo(this.handle);
  }
  set solo(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.trackSetSolo(this.handle, value);
    });
  }
  get mutedViaSolo() {
    return this.dataModel.trackGetMutedViaSolo(this.handle);
  }
  get arm() {
    return this.dataModel.trackGetArm(this.handle);
  }
  set arm(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.trackSetArm(this.handle, value);
    });
  }
  get clipSlots() {
    return this.dataModel.trackGetClipSlots(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, ClipSlot));
  }
  get takeLanes() {
    return this.dataModel.trackGetTakeLanes(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, TakeLane));
  }
  get arrangementClips() {
    return this.dataModel.trackGetArrangementClips(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Clip));
  }
  get groupTrack() {
    const handle = this.dataModel.trackGetGroupTrack(this.handle);
    return handle ? this.objectRegistry.getObjectFromHandle(handle, Track2) : null;
  }
  get devices() {
    return this.dataModel.trackGetDevices(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Device));
  }
  get mixer() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.trackGetMixerDevice(this.handle), TrackMixer);
  }
  /** Appended to the end of {@link takeLanes}. */
  createTakeLane() {
    return createAsync(this.dataModel, this.objectRegistry, TakeLane, this.dataModel.trackCreateTakeLane, this.handle);
  }
  /**
  * Inserts a built-in Live device with its default preset into the track's device chain.
  * Only devices native to Live are supported — third-party plug-ins cannot be loaded this way.
  *
  * @param deviceName - The name of the built-in Live device (e.g. `"Reverb"`, `"Auto Filter"`).
  * @param index - Zero-based position in the device chain at which to insert.
  */
  insertDevice(deviceName, index) {
    return createAsync(this.dataModel, this.objectRegistry, Device, this.dataModel.trackInsertDevice, this.handle, deviceName, BigInt(index));
  }
  /**
  * Deletes a device from this track's device chain. Await the returned
  * promise to ensure the deletion has been fully processed.
  */
  deleteDevice(device) {
    return invokeAsync(this.dataModel, this.dataModel.trackDeleteDevice, this.handle, device.handle);
  }
  /** The duplicate is inserted directly after the original in the device chain. */
  duplicateDevice(device) {
    return createAsync(this.dataModel, this.objectRegistry, Device, this.dataModel.trackDuplicateDevice, this.handle, device.handle);
  }
  /**
  * Deletes an arrangement clip. For session clips, use {@link ClipSlot.deleteClip}.
  * Await the returned promise to ensure the deletion has been fully processed.
  */
  deleteClip(clip) {
    return invokeAsync(this.dataModel, this.dataModel.trackDeleteClip, this.handle, clip.handle);
  }
  /**
  * Deletes clips within the range. Clips that overlap a boundary are truncated
  * to the range edge rather than fully deleted.
  *
  * @param startTime - Start of the range in beats.
  * @param endTime - End of the range in beats.
  */
  clearClipsInRange(startTime, endTime) {
    return invokeAsync(this.dataModel, this.dataModel.trackClearClipsInRange, this.handle, startTime, endTime);
  }
};
var AudioTrack = class extends Track {
  static className = "AudioTrack";
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
  createAudioClip(args) {
    return createAsync(this.dataModel, this.objectRegistry, AudioClip, this.dataModel.trackCreateAudioClip, this.handle, {
      duration: args.duration,
      filePath: args.filePath,
      isWarped: args.isWarped,
      loopSettings: args.loopSettings,
      startTime: args.startTime
    });
  }
};
var CuePoint = class extends DataModelObject {
  static className = "CuePoint";
  get time() {
    return this.dataModel.cuePointGetTime(this.handle);
  }
  get name() {
    return this.dataModel.cuePointGetName(this.handle);
  }
  set name(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.cuePointSetName(this.handle, value);
    });
  }
};
var MidiTrack = class extends Track {
  static className = "MidiTrack";
  /**
  * @param startTime - Position in the arrangement in beats.
  * @param duration - Length of the clip in beats.
  */
  createMidiClip(startTime, duration) {
    return createAsync(this.dataModel, this.objectRegistry, MidiClip, this.dataModel.trackCreateMidiClip, this.handle, startTime, duration);
  }
};
var Scene = class extends DataModelObject {
  static className = "Scene";
  get name() {
    return this.dataModel.sceneGetName(this.handle);
  }
  set name(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.sceneSetName(this.handle, value);
    });
  }
  get tempo() {
    return this.dataModel.sceneGetTempo(this.handle);
  }
  get signatureNumerator() {
    return this.dataModel.sceneGetSignatureNumerator(this.handle);
  }
  get signatureDenominator() {
    return this.dataModel.sceneGetSignatureDenominator(this.handle);
  }
};
var Song = class extends DataModelObject {
  static className = "Song";
  /** Regular tracks only — excludes return tracks and the main track. */
  get tracks() {
    return this.dataModel.songGetTracks(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Track));
  }
  get returnTracks() {
    return this.dataModel.songGetReturnTracks(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Track));
  }
  get mainTrack() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.songGetMainTrack(this.handle), Track);
  }
  get scenes() {
    return this.dataModel.songGetScenes(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Scene));
  }
  get cuePoints() {
    return this.dataModel.songGetCuePoints(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, CuePoint));
  }
  get tempo() {
    return this.dataModel.songGetTempo(this.handle);
  }
  set tempo(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.songSetTempo(this.handle, value);
    });
  }
  /**
  * The current arrangement grid quantization. Use with {@link gridIsTriplet} to
  * determine the full grid setting.
  */
  get gridQuantization() {
    return this.dataModel.songGetGridQuantization(this.handle);
  }
  /**
  * Whether the arrangement grid uses triplet subdivisions of the current
  * {@link gridQuantization} value.
  */
  get gridIsTriplet() {
    return this.dataModel.songGetGridIsTriplet(this.handle);
  }
  /**
  * The root note of the scale currently selected in Live, as a MIDI note number
  * from 0 (C) to 11 (B).
  */
  get rootNote() {
    return Number(this.dataModel.songGetRootNote(this.handle));
  }
  /** The name of the scale selected in Live, as shown in the Current Scale Name chooser. */
  get scaleName() {
    return this.dataModel.songGetScaleName(this.handle);
  }
  /** Whether Live's Scale Mode is enabled. */
  get scaleMode() {
    return this.dataModel.songGetScaleMode(this.handle);
  }
  /** The intervals of the current scale as semitone offsets from the root note. */
  get scaleIntervals() {
    return this.dataModel.songGetScaleIntervals(this.handle).map(Number);
  }
  /** Inserted after the last selected track, or appended if no track is selected. */
  createAudioTrack() {
    return createAsync(this.dataModel, this.objectRegistry, AudioTrack, this.dataModel.songCreateAudioTrack, this.handle);
  }
  /** Inserted after the last selected track, or appended if no track is selected. */
  createMidiTrack() {
    return createAsync(this.dataModel, this.objectRegistry, MidiTrack, this.dataModel.songCreateMidiTrack, this.handle);
  }
  /**
  * @param index - 0-based insert position in the range `[0, song.scenes.length]`.
  * Pass `-1` to append at the end.
  */
  createScene(index) {
    return createAsync(this.dataModel, this.objectRegistry, Scene, this.dataModel.songCreateScene, this.handle, BigInt(index));
  }
  /**
  * Deletes a track from the song. Await the returned promise to ensure the
  * deletion has been fully processed.
  */
  deleteTrack(track) {
    return invokeAsync(this.dataModel, this.dataModel.songDeleteTrack, this.handle, track.handle);
  }
  /**
  * Deletes a scene from the song. Await the returned promise to ensure the
  * deletion has been fully processed.
  */
  deleteScene(scene) {
    return invokeAsync(this.dataModel, this.dataModel.songDeleteScene, this.handle, scene.handle);
  }
  /** Duplicates the track. The duplicate is inserted immediately after the original. */
  duplicateTrack(track) {
    return createAsync(this.dataModel, this.objectRegistry, Track, this.dataModel.songDuplicateTrack, this.handle, track.handle);
  }
  /** Duplicates the scene. The duplicate is inserted immediately after the original. */
  duplicateScene(scene) {
    return createAsync(this.dataModel, this.objectRegistry, Scene, this.dataModel.songDuplicateScene, this.handle, scene.handle);
  }
  /** @param time - Position in the arrangement in beats. */
  createCuePoint(time) {
    return createAsync(this.dataModel, this.objectRegistry, CuePoint, this.dataModel.songCreateCuePoint, this.handle, time);
  }
  /**
  * Deletes a cue point from the song. Await the returned promise to ensure
  * the deletion has been fully processed.
  */
  deleteCuePoint(cuePoint) {
    return invokeAsync(this.dataModel, this.dataModel.songDeleteCuePoint, this.handle, cuePoint.handle);
  }
};
var Application = class extends DataModelObject {
  static className = "Application";
  get song() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.rootGetSong(this.handle), Song);
  }
};
var Commands = class {
  module;
  /** @internal */
  constructor(module2) {
    this.module = module2;
  }
  /**
  * Registers a command that can be invoked by Live or via {@link Commands.executeCommand}.
  *
  * @param commandId - A unique string identifier for this command.
  * @param callback - Called when the command is invoked. May receive arguments passed by the invoker.
  */
  registerCommand(commandId, callback) {
    this.module.registerCommand(commandId, callback);
  }
  /**
  * Programmatically invokes a registered command.
  *
  * @param commandId - The ID of the command to invoke.
  * @param args - Arguments to pass to the command's callback.
  */
  executeCommand(commandId, ...args) {
    this.module.executeCommand(commandId, ...args);
  }
};
var ChainMixer = class extends DataModelObject {
  static className = "ChainMixerDevice";
  get volume() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.chainmixerdeviceGetVolume(this.handle), DeviceParameter);
  }
  get panning() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.chainmixerdeviceGetPanning(this.handle), DeviceParameter);
  }
  get sends() {
    return this.dataModel.chainmixerdeviceGetSends(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, DeviceParameter));
  }
};
var Chain = class extends DataModelObject {
  static className = "Chain";
  get devices() {
    return this.dataModel.chainGetDevices(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Device));
  }
  get mixer() {
    return this.objectRegistry.getObjectFromHandle(this.dataModel.chainGetMixerDevice(this.handle), ChainMixer);
  }
  /**
  * Inserts a built-in Live device with its default preset into the chain.
  * Only devices native to Live are supported — third-party plug-ins cannot be loaded this way.
  *
  * @param deviceName - The name of the built-in Live device (e.g. `"Reverb"`, `"Auto Filter"`).
  * @param index - Zero-based position in the device chain at which to insert.
  */
  insertDevice(deviceName, index) {
    return createAsync(this.dataModel, this.objectRegistry, Device, this.dataModel.chainInsertDevice, this.handle, deviceName, BigInt(index));
  }
  /**
  * Deletes a device from this chain. Await the returned promise to ensure
  * the deletion has been fully processed.
  */
  deleteDevice(device) {
    return invokeAsync(this.dataModel, this.dataModel.chainDeleteDevice, this.handle, device.handle);
  }
  /** The duplicate is inserted directly after the original in the device chain. */
  duplicateDevice(device) {
    return createAsync(this.dataModel, this.objectRegistry, Device, this.dataModel.chainDuplicateDevice, this.handle, device.handle);
  }
};
var DrumChain = class extends Chain {
  static className = "DrumChain";
  get receivingNote() {
    return Number(this.dataModel.drumchainGetReceivingNote(this.handle));
  }
  set receivingNote(value) {
    this.dataModel.withinTransaction(() => {
      this.dataModel.drumchainSetReceivingNote(this.handle, BigInt(value));
    });
  }
};
var RackDevice = class extends Device {
  static className = "RackDevice";
  get chains() {
    return this.dataModel.rackdeviceGetChains(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, Chain));
  }
  /** @param index - 0-based insert position in the range `[0, rack.chains.length]`. */
  insertChain(index) {
    return createAsync(this.dataModel, this.objectRegistry, Chain, this.dataModel.rackdeviceInsertChain, this.handle, BigInt(index));
  }
};
var DrumRack = class extends RackDevice {
  static className = "DrumRackDevice";
  get chains() {
    return this.dataModel.rackdeviceGetChains(this.handle).map((handle) => this.objectRegistry.getObjectFromHandle(handle, DrumChain));
  }
};
var Sample = class extends DataModelObject {
  static className = "Sample";
  get filePath() {
    return this.dataModel.sampleGetFilePath(this.handle);
  }
};
var Simpler = class extends Device {
  static className = "Simpler";
  get sample() {
    const handle = this.dataModel.simplerGetSample(this.handle);
    return handle ? this.objectRegistry.getObjectFromHandle(handle, Sample) : null;
  }
  /** Replaces the loaded sample with the audio file at the given absolute path. */
  replaceSample(filePath) {
    return createAsync(this.dataModel, this.objectRegistry, Sample, this.dataModel.simplerReplaceSample, this.handle, filePath);
  }
};
var dataModelClasses = [
  Application,
  Song,
  AudioTrack,
  MidiTrack,
  Track,
  AudioClip,
  MidiClip,
  Clip,
  ClipSlot,
  TakeLane,
  Simpler,
  DrumRack,
  RackDevice,
  Device,
  Sample,
  DrumChain,
  Chain,
  Scene,
  CuePoint,
  DeviceParameter,
  TrackMixer,
  ChainMixer
];
var DataModelObjectRegistry = class {
  cache = /* @__PURE__ */ new Map();
  dataModel;
  /** @internal */
  constructor(dataModel) {
    this.dataModel = dataModel;
  }
  getOrCreateObjectFromHandle(handle) {
    const cached = this.cache.get(handle.id);
    if (cached) return cached;
    const ModelClass = dataModelClasses.find((cls) => this.dataModel.getObjectIsOfClass(handle, cls.className));
    if (!ModelClass) throw new Error("Unknown object type");
    const obj = new ModelClass(handle, this.dataModel, this);
    this.cache.set(handle.id, obj);
    return obj;
  }
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
  getObjectFromHandle(handle, type) {
    const obj = this.getOrCreateObjectFromHandle(handle);
    if (!(obj instanceof type)) throw new Error("Object of incorrect type");
    return obj;
  }
};
var Environment = class {
  module;
  /** @internal */
  constructor(module2) {
    this.module = module2;
  }
  /**
  * Per-extension directory for persistent storage. Use it for configuration, credentials,
  * and cached state — anything that should survive across Live sessions.
  */
  get storageDirectory() {
    return this.module.storageDirectory;
  }
  /**
  * Per-extension directory for temporary files, such as intermediate audio or analysis
  * results. May be cleaned up between sessions.
  */
  get tempDirectory() {
    return this.module.tempDirectory;
  }
  /** Live's current UI language as an uppercase ISO 639-1 code (e.g. `"EN"`, `"DE"`, `"JA"`). */
  get language() {
    return this.module.language;
  }
};
var Resources = class {
  module;
  /** @internal */
  constructor(module2) {
    this.module = module2;
  }
  /**
  * Renders the pre-effects audio of a track in the arrangement between two beat
  * positions. Returns a path to a WAV file written to the extension's temp directory.
  */
  renderPreFxAudio(track, startTime, endTime) {
    return new Promise((resolve, reject) => {
      this.module.renderPreFxAudio(track.handle, {
        endTime,
        startTime
      }, resolve, reject);
    });
  }
  /**
  * Copies a file into the Live project folder so that Live manages it.
  * Returns the path to the imported copy. Use the returned path in subsequent API
  * calls, not the original.
  */
  importIntoProject(filePath) {
    return new Promise((resolve, reject) => {
      this.module.importIntoProject(filePath, resolve, reject);
    });
  }
};
var toProgressOptions = (text, progress) => typeof progress === "number" ? {
  progress,
  text
} : { text };
var Ui = class {
  module;
  /** @internal */
  constructor(module2) {
    this.module = module2;
  }
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
  registerContextMenuAction(scope, title, commandId) {
    return new Promise((resolve) => {
      this.module.registerContextMenuAction(scope, title, commandId, (unregister) => {
        resolve(() => new Promise((done) => {
          unregister(done);
        }));
      });
    });
  }
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
  showModalDialog(url, width, height) {
    return new Promise((resolve, reject) => {
      this.module.showModalDialog(url, width, height, resolve, reject);
    });
  }
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
  withinProgressDialog(text, options, callback) {
    const ac = new AbortController();
    return new Promise((resolve, reject) => {
      this.module.showProgressDialog(toProgressOptions(text, options.progress), ({ update, close }) => {
        const asyncUpdate = (updateText, progress) => new Promise((resolveUpdate) => {
          update(toProgressOptions(updateText, progress), resolveUpdate);
        });
        const asyncClose = () => new Promise((done) => {
          close(done);
        });
        callback(asyncUpdate, ac.signal).finally(asyncClose).then(resolve).catch(reject);
      }, () => {
        ac.abort();
      });
    });
  }
};
var initialize = (context, apiVersion) => {
  const { commands, dataModel, environment, resources, ui } = context.initializeExtensionHost({ apiVersion });
  const objectRegistry = new DataModelObjectRegistry(dataModel);
  return {
    application: objectRegistry.getObjectFromHandle(dataModel.getRoot(), Application),
    commands: new Commands(commands),
    environment: new Environment(environment),
    getObjectFromHandle: objectRegistry.getObjectFromHandle.bind(objectRegistry),
    resources: new Resources(resources),
    ui: new Ui(ui),
    withinTransaction: dataModel.withinTransaction.bind(dataModel)
  };
};

// src/dialog.html
var dialog_default = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BBC Sound Effects</title>
  <style>
    @font-face {
      font-family: "AbletonSansSmall";
      font-weight: 400;
      src: url("/Applications/Ableton Live 12.4 Beta.app/Contents/App-Resources/Fonts/AbletonSansSmall-Regular.ttf") format("truetype");
    }
    @font-face {
      font-family: "AbletonSansSmall";
      font-weight: 700;
      src: url("/Applications/Ableton Live 12.4 Beta.app/Contents/App-Resources/Fonts/AbletonSansSmall-Bold.ttf") format("truetype");
    }

    :root {
      --bg:           hsl(0, 0%, 16%);
      --bg-raised:    hsl(0, 0%, 20%);
      --bg-sunken:    hsl(0, 0%, 11%);
      --border:       hsl(0, 0%, 8%);
      --border-mid:   hsl(0, 0%, 24%);
      --text:         hsl(0, 0%, 72%);
      --text-dim:     hsl(0, 0%, 42%);
      --accent:       hsl(0, 80%, 42%);   /* BBC red */
      --accent-dim:   hsl(0, 70%, 34%);
      --accent-glow:  hsla(0, 80%, 42%, 0.15);
      --error:        hsl(0, 65%, 58%);
      --tag-bg:       hsl(0, 0%, 13%);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    * { -webkit-user-select: none; user-select: none; }
    input, textarea { -webkit-user-select: text; user-select: text; }

    html, body {
      background: var(--bg);
      color: var(--text);
      font-family: "AbletonSansSmall", "Lucida Grande", sans-serif;
      font-size: 11.5px;
      height: 100vh;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: 14px 16px;
      gap: 10px;
    }

    .hidden { display: none !important; }

    /* \u2500\u2500 Header \u2500\u2500 */
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .header-left { display: flex; align-items: center; gap: 9px; }
    .bbc-mark {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
    }
    .bbc-box {
      width: 16px;
      height: 16px;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.5px;
    }
    .page-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--text);
    }
    .page-subtitle {
      font-size: 10px;
      color: var(--text-dim);
      margin-top: 1px;
    }

    /* \u2500\u2500 Divider \u2500\u2500 */
    .divider { height: 1px; background: var(--border-mid); flex-shrink: 0; }

    /* \u2500\u2500 Search row \u2500\u2500 */
    .search-row {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      align-items: flex-end;
    }

    .search-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      font-size: 10px;
      color: var(--text-dim);
      letter-spacing: 0.04em;
    }

    #query {
      width: 100%;
      background: var(--bg-sunken);
      border: 1px solid var(--border);
      border-bottom: 2px solid var(--accent-dim);
      color: var(--text);
      font-family: inherit;
      font-size: 12px;
      padding: 6px 9px;
      outline: none;
      transition: border-color 0.15s;
    }
    #query:focus { border-color: var(--accent); border-bottom-color: var(--accent); }
    #query::placeholder { color: var(--text-dim); }

    /* \u2500\u2500 Filter row \u2500\u2500 */
    .filter-row {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    .field { display: flex; flex-direction: column; gap: 4px; flex: 1; }

    select {
      background: var(--bg-sunken);
      border: 1px solid var(--border);
      color: var(--text);
      font-family: inherit;
      font-size: 11px;
      padding: 4px 20px 4px 6px;
      outline: none;
      width: 100%;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 5'%3E%3Cpath d='M0 0l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 6px center;
      background-size: 8px;
      transition: border-color 0.12s;
    }
    select:focus { border-color: var(--accent-dim); }

    /* \u2500\u2500 Buttons \u2500\u2500 */
    .btn {
      height: 24px;
      padding: 0 13px;
      font-size: 11px;
      font-family: inherit;
      font-weight: 400;
      border: 1px solid var(--border-mid);
      cursor: pointer;
      background: var(--bg-raised);
      color: var(--text);
      white-space: nowrap;
      transition: background 0.1s, border-color 0.1s;
      border-radius: 12px;
    }
    .btn:hover:not(:disabled) { background: var(--bg-sunken); border-color: var(--text-dim); }
    .btn:disabled { opacity: 0.35; cursor: default; }
    .btn.primary {
      background: var(--accent-dim);
      border-color: var(--accent-dim);
      color: #fff;
      font-weight: 700;
    }
    .btn.primary:hover:not(:disabled) { background: var(--accent); border-color: var(--accent); }

    /* \u2500\u2500 Results list \u2500\u2500 */
    #results-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-height: 0;
    }
    #results-list::-webkit-scrollbar { width: 4px; }
    #results-list::-webkit-scrollbar-track { background: transparent; }
    #results-list::-webkit-scrollbar-thumb { background: var(--border-mid); border-radius: 2px; }
    #results-list::-webkit-scrollbar-thumb:hover { background: var(--accent-dim); }

    /* \u2500\u2500 Result card \u2500\u2500 */
    .result-card {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 8px 10px 8px 11px;
      background: var(--bg-raised);
      border-left: 2px solid transparent;
      cursor: pointer;
      flex-shrink: 0;
      transition: border-color 0.1s, background 0.1s;
    }
    .result-card:hover {
      background: hsl(0, 0%, 22%);
      border-left-color: var(--accent);
    }
    .card-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
    .card-desc {
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text);
    }
    .card-location {
      font-size: 10px;
      color: var(--text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-meta {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }
    .card-dur {
      font-size: 10px;
      color: var(--text-dim);
      flex-shrink: 0;
    }
    .card-tag {
      font-size: 9px;
      background: var(--tag-bg);
      color: var(--text-dim);
      padding: 1px 5px;
      border-radius: 2px;
      border: 1px solid var(--border-mid);
    }
    .card-tag.cat {
      background: var(--accent-glow);
      border-color: var(--accent-dim);
      color: hsl(0, 60%, 70%);
    }

    /* \u2500\u2500 Preview button \u2500\u2500 */
    .preview-btn {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      background: transparent;
      border: 1px solid var(--border-mid);
      border-radius: 50%;
      color: var(--text-dim);
      font-size: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      font-family: inherit;
      transition: border-color 0.1s, color 0.1s, background 0.1s;
    }
    .preview-btn:hover { border-color: var(--accent-dim); color: var(--accent); }
    .preview-btn.playing {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-glow);
    }

    /* \u2500\u2500 Format toggle (WAV / MP3) on hover \u2500\u2500 */
    .card-format {
      flex-shrink: 0;
      font-size: 9px;
      color: var(--text-dim);
      border: 1px solid var(--border-mid);
      padding: 2px 5px;
      border-radius: 2px;
      cursor: pointer;
      background: var(--tag-bg);
      transition: border-color 0.1s, color 0.1s;
      user-select: none;
    }
    .card-format:hover { border-color: var(--accent-dim); color: var(--text); }
    .card-format.wav { border-color: var(--accent-dim); color: hsl(0, 60%, 70%); }

    /* \u2500\u2500 Empty state \u2500\u2500 */
    .empty-state {
      color: var(--text-dim);
      text-align: center;
      padding: 36px 0;
      line-height: 1.8;
      font-size: 11px;
    }

    /* \u2500\u2500 Status / footer \u2500\u2500 */
    .status {
      font-size: 10.5px;
      color: var(--text-dim);
      min-height: 14px;
      flex-shrink: 0;
      line-height: 1.4;
    }
    .status.error { color: var(--error); }

    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
      margin-top: auto;
    }
  </style>
</head>
<body oncontextmenu="return false">

  <!-- \u2500\u2500 SEARCH PAGE \u2500\u2500 -->
  <div class="page" id="page-search">
    <div class="header">
      <div class="header-left">
        <div class="bbc-mark">
          <div class="bbc-box">B</div>
          <div class="bbc-box">B</div>
          <div class="bbc-box">C</div>
        </div>
        <div class="page-title">Sound Effects</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="search-row">
      <div class="search-wrap">
        <label class="label" for="query">Search 33,000+ BBC archive recordings</label>
        <input type="text" id="query" placeholder="thunder, crowd applause, steam train\u2026" />
      </div>
      <button class="btn primary" id="search-btn" onclick="startSearch()" style="align-self:flex-end; margin-bottom:1px;">Search</button>
    </div>

    <div class="filter-row">
      <div class="field">
        <label class="label" for="category">Category</label>
        <select id="category">
          <option value="">All categories</option>
          <option value="Nature">Nature</option>
          <option value="Transport">Transport</option>
          <option value="Animals">Animals</option>
          <option value="Daily_Life">Daily Life</option>
          <option value="Footsteps">Footsteps</option>
          <option value="Sport">Sport</option>
          <option value="Electronics">Electronics</option>
          <option value="Crowds">Crowds</option>
          <option value="Atmosphere">Atmosphere</option>
          <option value="Industry">Industry</option>
          <option value="Comedy">Comedy</option>
          <option value="Machines">Machines</option>
          <option value="Destruction">Destruction</option>
          <option value="Bells">Bells</option>
          <option value="Birds">Birds</option>
          <option value="Applause">Applause</option>
          <option value="Fire">Fire</option>
          <option value="Medical">Medical</option>
          <option value="Toys">Toys</option>
          <option value="Events">Events</option>
        </select>
      </div>
      <div class="field">
        <label class="label" for="maxdur">Max duration</label>
        <select id="maxdur">
          <option value="">Any</option>
          <option value="5000">\u2264 5s</option>
          <option value="15000">\u2264 15s</option>
          <option value="30000">\u2264 30s</option>
          <option value="60000">\u2264 1 min</option>
          <option value="300000">\u2264 5 min</option>
        </select>
      </div>
      <div class="field">
        <label class="label" for="sortby">Sort</label>
        <select id="sortby">
          <option value="">Relevance</option>
          <option value="duration_asc">Shortest first</option>
          <option value="duration_desc">Longest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="date_desc">Newest first</option>
        </select>
      </div>
    </div>

    <div class="status" id="search-status"></div>

    <div class="footer">
      <button class="btn" onclick="cancel()">Cancel</button>
    </div>
  </div>

  <!-- \u2500\u2500 RESULTS PAGE \u2500\u2500 -->
  <div class="page hidden" id="page-results">
    <div class="header">
      <div class="header-left">
        <div class="bbc-mark">
          <div class="bbc-box">B</div>
          <div class="bbc-box">B</div>
          <div class="bbc-box">C</div>
        </div>
        <div>
          <div class="page-title">Sound Effects</div>
          <div class="page-subtitle" id="results-subtitle"></div>
        </div>
      </div>
      <button class="btn" onclick="backToSearch()">\u2190 Back</button>
    </div>

    <div class="divider"></div>

    <div id="results-list">
      <div class="empty-state hidden" id="no-results-msg">
        No sounds found for that query.<br>Try broader terms or a different category.
      </div>
    </div>

    <div class="status" id="results-status"></div>

    <div class="footer">
      <button class="btn" id="more-btn" onclick="loadMore()" style="display:none;">Load more</button>
      <button class="btn" onclick="cancel()">Cancel</button>
    </div>
  </div>

  <script>
    var API = "https://sound-effects-api.bbcrewind.co.uk";
    var MEDIA = "https://sound-effects-media.bbcrewind.co.uk";
    var PAGE_SIZE = 15;

    // \u2500\u2500 Bridge \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function sendResult(value) {
      var msg = { method: "close_and_send", params: [JSON.stringify(value)] };
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.live) {
        window.webkit.messageHandlers.live.postMessage(msg);
      } else if (window.chrome && window.chrome.webview) {
        window.chrome.webview.postMessage(msg);
      }
    }
    function cancel() { sendResult(null); }

    // \u2500\u2500 Pages \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function showPage(id) {
      ["page-search", "page-results"].forEach(function(p) {
        document.getElementById(p).classList.toggle("hidden", p !== id);
      });
    }
    function backToSearch() {
      stopPreview();
      setStatus("search-status", "", false);
      showPage("page-search");
    }

    // \u2500\u2500 Status \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function setStatus(elId, msg, isError) {
      var el = document.getElementById(elId);
      el.textContent = msg;
      el.className = "status" + (isError ? " error" : "");
    }

    // \u2500\u2500 Duration formatting \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function fmtDuration(ms) {
      var s = Math.round(ms / 1000);
      if (s < 60) return s + "s";
      var m = Math.floor(s / 60), rem = s % 60;
      return m + "m " + (rem > 0 ? rem + "s" : "");
    }

    // \u2500\u2500 Pagination state \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var state = { query: "", category: "", maxDur: "", sortBy: "", from: 0, total: 0 };

    // \u2500\u2500 BBC API search \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function searchBbc(query, category, maxDur, sortBy, from) {
      var criteria = { query: query, limit: PAGE_SIZE, from: from };
      if (category) criteria.category = category;
      if (maxDur) criteria.maxDuration = parseInt(maxDur, 10);
      if (sortBy) criteria.sort = sortBy;

      var resp = await fetch(API + "/api/sfx/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ criteria: criteria })
      });

      if (!resp.ok) throw new Error("BBC API error: HTTP " + resp.status);
      return await resp.json();
    }

    // \u2500\u2500 Audio preview \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    var currentAudio = null;
    var currentPlayBtn = null;

    function stopPreview() {
      if (currentAudio) { currentAudio.pause(); currentAudio.src = ""; currentAudio = null; }
      if (currentPlayBtn) { currentPlayBtn.textContent = "\u25B6"; currentPlayBtn.classList.remove("playing"); currentPlayBtn = null; }
    }

    function togglePreview(e, id, btn) {
      e.stopPropagation();
      if (currentAudio && currentPlayBtn === btn) { stopPreview(); return; }
      stopPreview();
      var audio = new Audio(MEDIA + "/mp3/" + id + ".mp3");
      currentAudio = audio;
      currentPlayBtn = btn;
      btn.textContent = "\u25A0";
      btn.classList.add("playing");
      audio.onended = function() { if (currentAudio === audio) stopPreview(); };
      audio.onerror = function() { if (currentAudio === audio) stopPreview(); };
      audio.play().catch(function() { if (currentAudio === audio) stopPreview(); });
    }

    // \u2500\u2500 Format toggle \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function toggleFormat(e, btn) {
      e.stopPropagation();
      var isWav = btn.dataset.fmt === "wav";
      btn.dataset.fmt = isWav ? "mp3" : "wav";
      btn.textContent = isWav ? "MP3" : "WAV";
      btn.className = "card-format" + (isWav ? "" : " wav");
    }

    // \u2500\u2500 Render card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    function renderCard(sound) {
      var card = document.createElement("div");
      card.className = "result-card";

      // Body
      var body = document.createElement("div");
      body.className = "card-body";

      var desc = document.createElement("div");
      desc.className = "card-desc";
      // Use bandDescription if available, otherwise description
      var mainLabel = (sound.additionalMetadata && sound.additionalMetadata.bandDescription)
        ? sound.additionalMetadata.bandDescription
        : sound.description;
      desc.textContent = mainLabel;
      desc.title = sound.description; // full description on hover
      body.appendChild(desc);

      // Location / recordist line
      var locParts = [];
      if (sound.additionalMetadata) {
        if (sound.additionalMetadata.locationText) locParts.push(sound.additionalMetadata.locationText);
        if (sound.additionalMetadata.recordist) locParts.push("rec. " + sound.additionalMetadata.recordist);
      }
      if (locParts.length) {
        var loc = document.createElement("div");
        loc.className = "card-location";
        loc.textContent = locParts.join(" \xB7 ");
        body.appendChild(loc);
      }

      // Meta row: duration + category tags + first 2 tags
      var meta = document.createElement("div");
      meta.className = "card-meta";

      var dur = document.createElement("span");
      dur.className = "card-dur";
      dur.textContent = fmtDuration(sound.duration);
      meta.appendChild(dur);

      // Top category
      if (sound.categories && sound.categories.length) {
        var catTag = document.createElement("span");
        catTag.className = "card-tag cat";
        catTag.textContent = sound.categories[0].className.replace(/_/g, " ");
        meta.appendChild(catTag);
      }

      // First 2 descriptive tags
      if (sound.tags) {
        sound.tags.slice(0, 2).forEach(function(t) {
          var tag = document.createElement("span");
          tag.className = "card-tag";
          tag.textContent = t;
          meta.appendChild(tag);
        });
      }

      body.appendChild(meta);
      card.appendChild(body);

      // WAV/MP3 format toggle
      var fmtBtn = document.createElement("span");
      fmtBtn.className = "card-format wav";
      fmtBtn.dataset.fmt = "wav";
      fmtBtn.textContent = "WAV";
      fmtBtn.title = "Click to switch between WAV and MP3";
      fmtBtn.onclick = function(e) { toggleFormat(e, fmtBtn); };
      card.appendChild(fmtBtn);

      // Preview button
      var playBtn = document.createElement("button");
      playBtn.className = "preview-btn";
      playBtn.textContent = "\u25B6";
      playBtn.title = "Preview (MP3)";
      playBtn.onclick = function(e) { togglePreview(e, sound.id, playBtn); };
      card.appendChild(playBtn);

      // Click card = download + insert
      card.onclick = function() {
        stopPreview();
        sendResult({
          id: sound.id,
          description: sound.description,
          duration: sound.duration,
          format: fmtBtn.dataset.fmt
        });
      };

      return card;
    }

    // \u2500\u2500 Load more \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function loadMore() {
      var btn = document.getElementById("more-btn");
      btn.disabled = true;
      setStatus("results-status", "Loading more\u2026", false);
      try {
        var nextFrom = state.from + PAGE_SIZE;
        var data = await searchBbc(state.query, state.category, state.maxDur, state.sortBy, nextFrom);
        if (!data.results || !data.results.length) {
          btn.style.display = "none";
          setStatus("results-status", "No more results.", false);
          return;
        }
        var list = document.getElementById("results-list");
        data.results.forEach(function(s) { list.appendChild(renderCard(s)); });
        state.from = nextFrom;
        if (state.from + PAGE_SIZE >= state.total) btn.style.display = "none";
        setStatus("results-status", "", false);
      } catch (err) {
        setStatus("results-status", "Error: " + err.message, true);
      } finally {
        btn.disabled = false;
      }
    }

    // \u2500\u2500 Main search \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    async function startSearch() {
      var query = document.getElementById("query").value.trim();
      if (!query) { setStatus("search-status", "Please enter a search term.", true); return; }

      var category = document.getElementById("category").value;
      var maxDur   = document.getElementById("maxdur").value;
      var sortBy   = document.getElementById("sortby").value;

      document.getElementById("search-btn").disabled = true;
      setStatus("search-status", "Searching BBC Sound Effects\u2026", false);

      try {
        var data = await searchBbc(query, category, maxDur, sortBy, 0);

        if (!data.results || !data.results.length) {
          setStatus("search-status", "No sounds found. Try different terms.", true);
          document.getElementById("search-btn").disabled = false;
          return;
        }

        showPage("page-results");
        var list = document.getElementById("results-list");
        list.innerHTML = "";
        data.results.forEach(function(s) { list.appendChild(renderCard(s)); });

        state.query = query; state.category = category;
        state.maxDur = maxDur; state.sortBy = sortBy;
        state.from = 0; state.total = data.total;

        var action = (window.BBC_MODE === "simpler") ? "click to load into Simpler" : "click to download";
        document.getElementById("results-subtitle").textContent =
          data.total.toLocaleString() + " sounds found \xB7 " + action;

        var moreBtn = document.getElementById("more-btn");
        moreBtn.style.display = (state.total > PAGE_SIZE) ? "block" : "none";
        moreBtn.disabled = false;
        setStatus("results-status", "", false);

      } catch (err) {
        setStatus("search-status", "Error: " + err.message, true);
      } finally {
        document.getElementById("search-btn").disabled = false;
      }
    }

    // \u2500\u2500 Keyboard \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") cancel();
      if (e.key === "Enter" && !document.getElementById("page-search").classList.contains("hidden")) {
        startSearch();
      }
    });

    // Reset to clean search state every time the dialog opens
    function resetToSearch() {
      stopPreview();
      showPage("page-search");
      document.getElementById("query").value = "";
      document.getElementById("results-list").innerHTML = "";
      document.getElementById("more-btn").style.display = "none";
      setStatus("search-status", "", false);
      setStatus("results-status", "", false);
      document.getElementById("search-btn").disabled = false;
      document.getElementById("query").focus();
    }

    // visibilitychange fires when the dialog is reshown (hidden \u2192 visible)
    // This is more reliable than focus/pageshow for reused WebViews
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) resetToSearch();
    });

    // Also cover fresh page loads
    window.addEventListener("pageshow", resetToSearch);

    // Immediate call for initial load
    resetToSearch();
  </script>
</body>
</html>
`;

// src/extension.ts
function isArrangementSelection(arg) {
  return typeof arg === "object" && arg !== null && "selected_lanes" in arg && Array.isArray(arg.selected_lanes);
}
function sanitizeFilename(input, maxLength = 80) {
  return input.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").replace(/\s+/g, "_").replace(/_+/g, "_").replace(/^[._]+|[._]+$/g, "").slice(0, maxLength) || "bbc_sound";
}
async function findExistingDownload(dir, id) {
  try {
    const entries = await fs.readdir(dir);
    const match = entries.find((e) => e.startsWith(id + "."));
    return match ? path.join(dir, match) : null;
  } catch {
    return null;
  }
}
async function downloadFile(url, dest, signal) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  return new Promise((resolve, reject) => {
    const file = (0, import_fs.createWriteStream)(dest);
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.destroy();
        reject(new Error(`HTTP ${res.statusCode} downloading from BBC`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
      file.on("error", reject);
    });
    req.on("error", reject);
    signal.addEventListener("abort", () => {
      req.destroy();
      file.destroy();
      reject(new DOMException("AbortError", "AbortError"));
    }, { once: true });
  });
}
function findFirstEmptySlot(track) {
  return track.clipSlots.find((s) => s.clip === null) ?? null;
}
function findArrangementEnd(track) {
  const clips = track.arrangementClips;
  if (clips.length === 0) return 0;
  return Math.max(...clips.map((c) => c.endTime));
}
async function showSearchDialog(context, mode) {
  const modeScript = `<script>window.BBC_MODE=${JSON.stringify(mode)};</script>`;
  const html = `<!-- ${Date.now()} -->` + dialog_default.replace("</head>", modeScript + "</head>");
  let raw;
  try {
    raw = await context.ui.showModalDialog(
      `data:text/html,${encodeURIComponent(html)}`,
      600,
      460
    );
  } catch {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
async function downloadSound(result, soundsDir, signal, update) {
  const ext = result.format === "wav" ? "wav" : "mp3";
  const url = `https://sound-effects-media.bbcrewind.co.uk/${ext}/${result.id}.${ext}`;
  const destPath = path.join(soundsDir, `${result.id}.${ext}`);
  const existing = await findExistingDownload(soundsDir, result.id);
  if (existing) {
    await update("File already downloaded, reusing\u2026", 50);
    return existing;
  }
  await update(`Downloading ${ext.toUpperCase()}\u2026`, 15);
  signal.throwIfAborted();
  await downloadFile(url, destPath, signal);
  await update("Download complete\u2026", 60);
  return destPath;
}
function makeErrorHtml(message) {
  const escaped = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<script>
  function close() {
    var msg = { method: "close_and_send", params: [JSON.stringify(null)] };
    if (window.webkit?.messageHandlers?.live) window.webkit.messageHandlers.live.postMessage(msg);
    else if (window.chrome?.webview) window.chrome.webview.postMessage(msg);
  }
</script>
<style>
  :root { --bg: #292929; --text: #c8c8c8; --accent: #cc3333; }
  html,body { background:var(--bg); color:var(--text); font-family:'Lucida Grande',sans-serif;
    font-size:12px; margin:0; height:100vh; display:flex; align-items:center; justify-content:center; }
  .wrap { padding:24px; max-width:420px; }
  p { margin:0 0 18px; line-height:1.6; white-space:pre-wrap; }
  button { background:var(--accent); color:#fff; border:none; padding:6px 16px;
    font-family:inherit; font-size:12px; cursor:pointer; border-radius:2px; }
</style></head><body>
  <div class="wrap"><p>${escaped}</p><div style="text-align:right"><button onclick="close()">OK</button></div></div>
</body></html>`;
}
async function showError(context, message) {
  try {
    await context.ui.showModalDialog(
      `data:text/html,${encodeURIComponent(makeErrorHtml(message))}`,
      480,
      200
    );
  } catch {
  }
}
async function activate(activation) {
  const context = initialize(activation, "1.0.0");
  for (const scope of ["AudioTrack", "AudioTrack.ArrangementSelection"]) {
    context.ui.registerContextMenuAction(scope, "BBC Sound Effects\u2026", "bbc.open-clip");
  }
  context.commands.registerCommand("bbc.open-clip", async (arg) => {
    console.log("[bbc-sound-effects] Audio track mode triggered");
    let track;
    let arrangementStartTime = null;
    if (isArrangementSelection(arg)) {
      if (!arg.selected_lanes?.length) {
        await showError(context, "No track lane selected.");
        return;
      }
      try {
        track = context.getObjectFromHandle(arg.selected_lanes[0], AudioTrack);
        arrangementStartTime = arg.time_selection_start;
      } catch {
        await showError(context, "Could not resolve track. Right-click an Audio Track lane.");
        return;
      }
    } else {
      try {
        track = context.getObjectFromHandle(arg, AudioTrack);
      } catch {
        await showError(context, "Could not resolve track. Right-click an Audio Track.");
        return;
      }
    }
    const soundsDir = path.join(
      context.environment.storageDirectory ?? path.join(os.homedir(), ".bbc-sound-effects"),
      "sounds"
    );
    const result = await showSearchDialog(context, "clip");
    if (!result) return;
    try {
      await context.ui.withinProgressDialog(
        "BBC Sound Effects",
        { progress: 0 },
        async (update, signal) => {
          signal.throwIfAborted();
          await update("Preparing download\u2026", 10);
          const filePath = await downloadSound(result, soundsDir, signal, update);
          signal.throwIfAborted();
          await update("Creating audio clip\u2026", 85);
          const clipName = sanitizeFilename(result.description, 64);
          let clip;
          if (arrangementStartTime !== null) {
            clip = await context.withinTransaction(
              () => track.createAudioClip({ filePath, startTime: arrangementStartTime, isWarped: true })
            );
          } else {
            const slot = findFirstEmptySlot(track);
            clip = slot ? await context.withinTransaction(
              () => slot.createAudioClip({ filePath, isWarped: true })
            ) : await context.withinTransaction(
              () => track.createAudioClip({
                filePath,
                startTime: findArrangementEnd(track),
                isWarped: true
              })
            );
          }
          context.withinTransaction(() => {
            clip.name = clipName.slice(0, 64);
          });
          await update("Done!", 100);
          console.log(`[bbc-sound-effects] Clip created: ${clip.name}`);
        }
      );
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("[bbc-sound-effects] Clip error:", err);
      await showError(context, String(err instanceof Error ? err.message : err));
    }
  });
  context.ui.registerContextMenuAction("Simpler", "BBC Sound Effects\u2026", "bbc.open-simpler");
  context.commands.registerCommand("bbc.open-simpler", async (arg) => {
    console.log("[bbc-sound-effects] Simpler mode triggered");
    let simpler;
    try {
      simpler = context.getObjectFromHandle(arg, Simpler);
    } catch {
      await showError(context, "Could not resolve Simpler device.");
      return;
    }
    const soundsDir = path.join(
      context.environment.storageDirectory ?? path.join(os.homedir(), ".bbc-sound-effects"),
      "sounds"
    );
    const result = await showSearchDialog(context, "simpler");
    if (!result) return;
    try {
      await context.ui.withinProgressDialog(
        "BBC Sound Effects",
        { progress: 0 },
        async (update, signal) => {
          signal.throwIfAborted();
          await update("Preparing download\u2026", 10);
          const wavResult = { ...result, format: "wav" };
          const filePath = await downloadSound(wavResult, soundsDir, signal, update);
          signal.throwIfAborted();
          await update("Loading into Simpler\u2026", 85);
          await context.withinTransaction(() => simpler.replaceSample(filePath));
          await update("Done!", 100);
          console.log(`[bbc-sound-effects] Loaded into Simpler: ${filePath}`);
        }
      );
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("[bbc-sound-effects] Simpler error:", err);
      await showError(context, String(err instanceof Error ? err.message : err));
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
