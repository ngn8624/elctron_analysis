import {
  ENUM_FFT_DBV_RANGE,
  ENUM_FFT_DC_IGNORE,
  ENUM_FFT_SAMPLE_NUM,
  ENUM_FFT_VIEW_MODE,
  ENUM_WINDOWS_INDEX,
  ENUM_STATISTICS_IGNORE,
} from '../constant/constant';
export class SettingModel {
  constructor({
    paths = '',
    fftCnt = ENUM_FFT_SAMPLE_NUM._4096,
    dcIgnore = ENUM_FFT_DC_IGNORE.FALSE,
    sampleInterval = 1,
    windowsIdx = ENUM_WINDOWS_INDEX.RECTANGLE,
    viewMode = ENUM_FFT_VIEW_MODE.DBV,
    dbvRange = ENUM_FFT_DBV_RANGE._100,
    RMS = ENUM_STATISTICS_IGNORE.FALSE,
    Mean = ENUM_STATISTICS_IGNORE.FALSE,
    MeanH = ENUM_STATISTICS_IGNORE.FALSE,
    MeanG = ENUM_STATISTICS_IGNORE.FALSE,
    StDev = ENUM_STATISTICS_IGNORE.FALSE, 
    Skew = ENUM_STATISTICS_IGNORE.FALSE,
    Kurt = ENUM_STATISTICS_IGNORE.FALSE,
    Mode = ENUM_STATISTICS_IGNORE.FALSE,
    Median = ENUM_STATISTICS_IGNORE.FALSE,
    Q1 = ENUM_STATISTICS_IGNORE.FALSE,
    Q3 = ENUM_STATISTICS_IGNORE.FALSE,
    IQR = ENUM_STATISTICS_IGNORE.FALSE,
  }) {
    this.paths = paths;
    this.fftCnt = fftCnt;
    this.dcIgnore = dcIgnore;
    this.sampleInterval = sampleInterval;
    this.windowsIdx = windowsIdx;
    this.viewMode = viewMode;
    this.dbvRange = dbvRange;
    this.RMS = RMS;
    this.Mean = Mean;
    this.MeanH = MeanH;
    this.MeanG = MeanG;
    this.StDev = StDev;
    this.Skew = Skew;
    this.Kurt = Kurt;
    this.Mode = Mode;
    this.Median = Median;
    this.Q1 = Q1;
    this.Q3 = Q3;
    this.IQR = IQR;
  }
}
