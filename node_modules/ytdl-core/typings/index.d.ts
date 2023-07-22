declare module 'ytdl-core' {
  import { Readable } from 'stream';

  // Utility to trick auto-complete to propose T and still accept string (#1188)
  type ExtendString<T extends string> = T | Omit<string, T>;

  namespace ytdl {
    type Filter = 'audioandvideo' | 'videoandaudio' | 'video' | 'videoonly' | 'audio' | 'audioonly' | ((format: videoFormat) => boolean);

    interface getInfoOptions {
      lang?: string;
      requestCallback?: () => {};
      requestOptions?: {};
    }

    type ChooseFormatQuality = 'lowest' | 'highest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | 'lowestvideo';

    interface chooseFormatOptions {
      quality?: ExtendString<ChooseFormatQuality> | number | ExtendString<ChooseFormatQuality>[] | number[];
      filter?: Filter;
      format?: videoFormat;
    }

    interface downloadOptions extends getInfoOptions, chooseFormatOptions {
      range?: {
        start?: number;
        end?: number;
      };
      begin?: string | number | Date;
      liveBuffer?: number;
      highWaterMark?: number;
      IPv6Block?: string;
      dlChunkSize?: number;
    }

    type VideoFormatQuality = 'tiny' | 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'hd1440' | 'hd2160' | 'highres';

    interface videoFormat {
      itag: number;
      url: string;
      mimeType?: string;
      bitrate?: number;
      audioBitrate?: number;
      width?: number;
      height?: number;
      initRange?: { start: string; end: string };
      indexRange?: { start: string; end: string };
      lastModified: string;
      contentLength: string;
      quality: ExtendString<VideoFormatQuality>;
      qualityLabel: '144p' | '144p 15fps' | '144p60 HDR' | '240p' | '240p60 HDR' | '270p' | '360p' | '360p60 HDR'
        | '480p' | '480p60 HDR' | '720p' | '720p60' | '720p60 HDR' | '1080p' | '1080p60' | '1080p60 HDR' | '1440p'
        | '1440p60' | '1440p60 HDR' | '2160p' | '2160p60' | '2160p60 HDR' | '4320p' | '4320p60';
      projectionType?: 'RECTANGULAR';
      fps?: number;
      averageBitrate?: number;
      audioQuality?: 'AUDIO_QUALITY_LOW' | 'AUDIO_QUALITY_MEDIUM';
      colorInfo?: {
        primaries: string;
        transferCharacteristics: string;
        matrixCoefficients: string;
      };
      highReplication?: boolean;
      approxDurationMs?: string;
      targetDurationSec?: number;
      maxDvrDurationSec?: number;
      audioSampleRate?: string;
      audioChannels?: number;

      // Added by ytdl-core
      container: 'flv' | '3gp' | 'mp4' | 'webm' | 'ts';
      hasVideo: boolean;
      hasAudio: boolean;
      codecs: string;
      videoCodec?: string;
      audioCodec?: string;

      isLive: boolean;
      isHLS: boolean;
      isDashMPD: boolean;
    }

    interface thumbnail {
      url: string;
      width: number;
      height: number;
    }

    type CaptionTrackSimpleText = 'Afrikaans' | 'Albanian' | 'Amharic' | 'Arabic' | 'Armenian' | 'Azerbaijani' | 'Bangla' | 'Basque'
    | 'Belarusian' | 'Bosnian' | 'Bulgarian' | 'Burmese' | 'Catalan' | 'Cebuano' | 'Chinese (Simplified)'
    | 'Chinese (Traditional)' | 'Corsican' | 'Croatian' | 'Czech' | 'Danish' | 'Dutch' | 'English'
    | 'English (auto-generated)' | 'Esperanto' | 'Estonian' | 'Filipino' | 'Finnish' | 'French' | 'Galician'
    | 'Georgian' | 'German' | 'Greek' | 'Gujarati' | 'Haitian Creole' | 'Hausa' | 'Hawaiian' | 'Hebrew' | 'Hindi'
    | 'Hmong' | 'Hungarian' | 'Icelandic' | 'Igbo' | 'Indonesian' | 'Irish' | 'Italian' | 'Japanese' | 'Javanese'
    | 'Kannada' | 'Kazakh' | 'Khmer' | 'Korean' | 'Kurdish' | 'Kyrgyz' | 'Lao' | 'Latin' | 'Latvian' | 'Lithuanian'
    | 'Luxembourgish' | 'Macedonian' | 'Malagasy' | 'Malay' | 'Malayalam' | 'Maltese' | 'Maori' | 'Marathi'
    | 'Mongolian' | 'Nepali' | 'Norwegian' | 'Nyanja' | 'Pashto' | 'Persian' | 'Polish' | 'Portuguese' | 'Punjabi'
    | 'Romanian' | 'Russian' | 'Samoan' | 'Scottish Gaelic' | 'Serbian' | 'Shona' | 'Sindhi' | 'Sinhala' | 'Slovak'
    | 'Slovenian' | 'Somali' | 'Southern Sotho' | 'Spanish' | 'Spanish (Spain)' | 'Sundanese' | 'Swahili'
    | 'Swedish' | 'Tajik' | 'Tamil' | 'Telugu' | 'Thai' | 'Turkish' | 'Ukrainian' | 'Urdu' | 'Uzbek' | 'Vietnamese'
    | 'Welsh' | 'Western Frisian' | 'Xhosa' | 'Yiddish' | 'Yoruba' | 'Zulu';

    type CaptionTrackLanguageCode = 'af' | 'sq' | 'am' | 'ar' | 'hy' | 'az' | 'bn' | 'eu' | 'be' | 'bs' | 'bg' | 'my' | 'ca' | 'ceb'
    | 'zh-Hans' | 'zh-Hant' | 'co' | 'hr' | 'cs' | 'da' | 'nl' | 'en' | 'eo' | 'et' | 'fil' | 'fi' | 'fr' | 'gl'
    | 'ka' | 'de' | 'el' | 'gu' | 'ht' | 'ha' | 'haw' | 'iw' | 'hi' | 'hmn' | 'hu' | 'is' | 'ig' | 'id' | 'ga' | 'it'
    | 'ja' | 'jv' | 'kn' | 'kk' | 'km' | 'ko' | 'ku' | 'ky' | 'lo' | 'la' | 'lv' | 'lt' | 'lb' | 'mk' | 'mg' | 'ms'
    | 'ml' | 'mt' | 'mi' | 'mr' | 'mn' | 'ne' | 'no' | 'ny' | 'ps' | 'fa' | 'pl' | 'pt' | 'pa' | 'ro' | 'ru' | 'sm'
    | 'gd' | 'sr' | 'sn' | 'sd' | 'si' | 'sk' | 'sl' | 'so' | 'st' | 'es' | 'su' | 'sw' | 'sv' | 'tg' | 'ta' | 'te'
    | 'th' | 'tr' | 'uk' | 'ur' | 'uz' | 'vi' | 'cy' | 'fy' | 'xh' | 'yi' | 'yo' | 'zu';

    interface captionTrack {
      baseUrl: string;
      name: {
        simpleText: ExtendString<CaptionTrackSimpleText>;
      };
      vssId: string;
      languageCode: ExtendString<CaptionTrackLanguageCode>;
      kind: string;
      rtl?: boolean;
      isTranslatable: boolean;
    }

    interface audioTrack {
      captionTrackIndices: number[];
    }

    interface translationLanguage {
      languageCode: captionTrack['languageCode'];
      languageName: captionTrack['name'];
    }

    interface VideoDetails {
      videoId: string;
      title: string;
      shortDescription: string;
      lengthSeconds: string;
      keywords?: string[];
      channelId: string;
      isOwnerViewing: boolean;
      isCrawlable: boolean;
      thumbnails: thumbnail[];
      averageRating: number;
      allowRatings: boolean;
      viewCount: string;
      author: string;
      isPrivate: boolean;
      isUnpluggedCorpus: boolean;
      isLiveContent: boolean;
    }

    interface Media {
      category: string;
      category_url: string;
      game?: string;
      game_url?: string;
      year?: number;
      song?: string;
      artist?: string;
      artist_url?: string;
      writers?: string;
      licensed_by?: string;
      thumbnails: thumbnail[];
    }

    interface Author {
      id: string;
      name: string;
      avatar: string; // to remove later
      thumbnails?: thumbnail[];
      verified: boolean;
      user?: string;
      channel_url: string;
      external_channel_url?: string;
      user_url?: string;
      subscriber_count?: number;
    }

    interface MicroformatRenderer {
      thumbnail: {
        thumbnails: thumbnail[];
      };
      embed: {
        iframeUrl: string;
        flashUrl: string;
        width: number;
        height: number;
        flashSecureUrl: string;
      };
      title: {
        simpleText: string;
      };
      description: {
        simpleText: string;
      };
      lengthSeconds: string;
      ownerProfileUrl: string;
      ownerGplusProfileUrl?: string;
      externalChannelId: string;
      isFamilySafe: boolean;
      availableCountries: string[];
      isUnlisted: boolean;
      hasYpcMetadata: boolean;
      viewCount: string;
      category: string;
      publishDate: string;
      ownerChannelName: string;
      liveBroadcastDetails?: {
        isLiveNow: boolean;
        startTimestamp: string;
        endTimestamp?: string;
      };
      uploadDate: string;
    }

    interface storyboard {
      templateUrl: string;
      thumbnailWidth: number;
      thumbnailHeight: number;
      thumbnailCount: number;
      interval: number;
      columns: number;
      rows: number;
      storyboardCount: number;
    }

    interface Chapter {
      title: string;
      start_time: number;
    }

    interface MoreVideoDetails extends Omit<VideoDetails, 'author' | 'thumbnail' | 'shortDescription'>, Omit<MicroformatRenderer, 'title' | 'description'> {
      published: number;
      video_url: string;
      age_restricted: boolean;
      likes: number | null;
      dislikes: number | null;
      media: Media;
      author: Author;
      thumbnails: thumbnail[];
      storyboards: storyboard[];
      chapters: Chapter[];
      description: string | null;
    }

    interface videoInfo {
      iv_load_policy?: string;
      iv_allow_in_place_switch?: string;
      iv_endscreen_url?: string;
      iv_invideo_url?: string;
      iv3_module?: string;
      rmktEnabled?: string;
      uid?: string;
      vid?: string;
      focEnabled?: string;
      baseUrl?: string;
      storyboard_spec?: string;
      serialized_ad_ux_config?: string;
      player_error_log_fraction?: string;
      sffb?: string;
      ldpj?: string;
      videostats_playback_base_url?: string;
      innertube_context_client_version?: string;
      t?: string;
      fade_in_start_milliseconds: string;
      timestamp: string;
      ad3_module: string;
      relative_loudness: string;
      allow_below_the_player_companion: string;
      eventid: string;
      token: string;
      atc: string;
      cr: string;
      apply_fade_on_midrolls: string;
      cl: string;
      fexp: string[];
      apiary_host: string;
      fade_in_duration_milliseconds: string;
      fflags: string;
      ssl: string;
      pltype: string;
      enabled_engage_types: string;
      hl: string;
      is_listed: string;
      gut_tag: string;
      apiary_host_firstparty: string;
      enablecsi: string;
      csn: string;
      status: string;
      afv_ad_tag: string;
      idpj: string;
      sfw_player_response: string;
      account_playback_token: string;
      encoded_ad_safety_reason: string;
      tag_for_children_directed: string;
      no_get_video_log: string;
      ppv_remarketing_url: string;
      fmt_list: string[][];
      ad_slots: string;
      fade_out_duration_milliseconds: string;
      instream_long: string;
      allow_html5_ads: string;
      core_dbp: string;
      ad_device: string;
      itct: string;
      root_ve_type: string;
      excluded_ads: string;
      aftv: string;
      loeid: string;
      cver: string;
      shortform: string;
      dclk: string;
      csi_page_type: string;
      ismb: string;
      gpt_migration: string;
      loudness: string;
      ad_tag: string;
      of: string;
      probe_url: string;
      vm: string;
      afv_ad_tag_restricted_to_instream: string;
      gapi_hint_params: string;
      cid: string;
      c: string;
      oid: string;
      ptchn: string;
      as_launched_in_country: string;
      avg_rating: string;
      fade_out_start_milliseconds: string;
      midroll_prefetch_size: string;
      allow_ratings: string;
      thumbnail_url: string;
      iurlsd: string;
      iurlmq: string;
      iurlhq: string;
      iurlmaxres: string;
      ad_preroll: string;
      tmi: string;
      trueview: string;
      host_language: string;
      innertube_api_key: string;
      show_content_thumbnail: string;
      afv_instream_max: string;
      innertube_api_version: string;
      mpvid: string;
      allow_embed: string;
      ucid: string;
      plid: string;
      midroll_freqcap: string;
      ad_logging_flag: string;
      ptk: string;
      vmap: string;
      watermark: string[];
      dbp: string;
      ad_flags: string;
      html5player: string;
      formats: videoFormat[];
      related_videos: relatedVideo[];
      no_embed_allowed?: boolean;
      player_response: {
        playabilityStatus: {
          status: string;
          playableInEmbed: boolean;
          miniplayer: {
            miniplayerRenderer: {
              playbackMode: string;
            };
          };
          contextParams: string;
        };
        streamingData: {
          expiresInSeconds: string;
          formats: {}[];
          adaptiveFormats: {}[];
        };
        captions?: {
          playerCaptionsRenderer: {
            baseUrl: string;
            visibility: string;
          };
          playerCaptionsTracklistRenderer: {
            captionTracks: captionTrack[];
            audioTracks: audioTrack[];
            translationLanguages: translationLanguage[];
            defaultAudioTrackIndex: number;
          };
        };
        microformat: {
          playerMicroformatRenderer: MicroformatRenderer;
        };
        videoDetails: VideoDetails;
        playerConfig: {
          audioConfig: {
            loudnessDb: number;
            perceptualLoudnessDb: number;
            enablePerFormatLoudness: boolean;
          };
          streamSelectionConfig: { maxBitrate: string };
          mediaCommonConfig: { dynamicReadaheadConfig: {}[] };
          webPlayerConfig: { webPlayerActionsPorting: {}[] };
        };
      };
      videoDetails: MoreVideoDetails;
    }

    interface relatedVideo {
      id?: string;
      title?: string;
      published?: string;
      author: Author | 'string'; // to remove the `string` part later
      ucid?: string; // to remove later
      author_thumbnail?: string; // to remove later
      short_view_count_text?: string;
      view_count?: string;
      length_seconds?: number;
      video_thumbnail?: string; // to remove later
      thumbnails: thumbnail[];
      richThumbnails: thumbnail[];
      isLive: boolean;
    }

    function getBasicInfo(url: string, options?: getInfoOptions): Promise<videoInfo>;
    function getInfo(url: string, options?: getInfoOptions): Promise<videoInfo>;
    function downloadFromInfo(info: videoInfo, options?: downloadOptions): Readable;
    function chooseFormat(format: videoFormat | videoFormat[], options?: chooseFormatOptions): videoFormat | never;
    function filterFormats(formats: videoFormat | videoFormat[], filter?: Filter): videoFormat[];
    function validateID(string: string): boolean;
    function validateURL(string: string): boolean;
    function getURLVideoID(string: string): string | never;
    function getVideoID(string: string): string | never;
    const version: number;
  }

  function ytdl(link: string, options?: ytdl.downloadOptions): Readable;

  export = ytdl;
}
