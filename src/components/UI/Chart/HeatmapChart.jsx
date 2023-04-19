import {
  AxisScrollStrategies,
  AxisTickStrategies,
  ColorCSS,
  ColorHEX,
  emptyFill,
  emptyLine,
  lightningChart,
  LUT,
  PalettedFill,
  regularColorSteps,
  SolidFill,
  SolidLine,
  synchronizeAxisIntervals,
  Themes,
} from '@arction/lcjs';
import { makeFlatTheme } from '@arction/lcjs-themes';
import React, { useEffect, useRef } from 'react';
export default function HeatmapChart(props) {
  const { data, id, viewLength, arrayLength, heatData } = props;
  const chartRef = useRef(null);
  useEffect(() => {
    const flatDarkTheme = makeFlatTheme({
      backgroundColor: ColorHEX('#29282b'),
      textColor: ColorHEX('#5F5F5F'),
      dataColors: [ColorHEX('e24d42')],
      axisColor: ColorHEX('#262527'),
      gridLineColor: ColorHEX('#262527'),
      uiBackgroundColor: ColorHEX('#29282b'),
      uiBorderColor: ColorHEX('ffffff'),
      fontFamily: 'Verdana',
      isDark: true,
    });
    const lc = lightningChart();
    const dash = lc
      .Dashboard({
        webgl: 'webgl2',
        container: id,
        theme: flatDarkTheme,
        numberOfColumns: 2,
        numberOfRows: 2,
        disableAnimations: true,
        textPixelSnappingEnabled: false,
      })
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#2F2E30') }))
      .setColumnWidth(0, 0.5)
      .setColumnWidth(1, 0.5)
      .setRowHeight(0, 0.5)
      .setRowHeight(1, 0.5)
      .setSplitterStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX('#29282B') }),
        })
      );
    const chartSpectrogram = dash
      .createChartXY({
        columnIndex: 0,
        rowIndex: 0,
      })
      .setTitle('')
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#2F2E30') }))
      .setSeriesBackgroundFillStyle(
        new SolidFill({ color: ColorHEX('#2F2E30') })
      )
      .setSeriesBackgroundStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX('262527') }),
        })
      );

    const chartProjectionY = dash
      .createChartXY({
        columnIndex: 1,
        rowIndex: 0,
        disableAnimations: true,
      })
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#2F2E30') }))
      .setSeriesBackgroundFillStyle(
        new SolidFill({ color: ColorHEX('#2F2E30') })
      )
      .setSeriesBackgroundStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX('262527') }),
        })
      )
      .setTitleFillStyle(emptyFill)
      .setPadding({ bottom: 36 });
    const chartProjectionX = dash
      .createChartXY({
        columnIndex: 0,
        rowIndex: 1,
      })
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#2F2E30') }))
      .setSeriesBackgroundFillStyle(
        new SolidFill({ color: ColorHEX('#2F2E30') })
      )
      .setSeriesBackgroundStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX('262527') }),
        })
      )
      .setTitleFillStyle(emptyFill);

    const chart3d = dash
      .createChart3D({
        columnIndex: 1,
        rowIndex: 1,
      })
      .setTitle('')
      .setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#2F2E30') }))
      .setSeriesBackgroundFillStyle(
        new SolidFill({ color: ColorHEX('#2F2E30') })
      )
      .setSeriesBackgroundStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX('262527') }),
        })
      )
      .setPadding({ left: 0, right: 0, top: 0, bottom: 0 })
      .setTitleFillStyle(emptyFill);
    chart3d
      .getDefaultAxisX(AxisScrollStrategies.progressive)
      .setInterval({ start: 0, end: viewLength, stopAxisAfter: false });
    chart3d
      .getDefaultAxisY(AxisScrollStrategies.progressive)
      .setInterval({ start: 0, end: 8192, stopAxisAfter: false });
    chartProjectionY
      .getDefaultAxisY()
      .setScrollStrategy(undefined)
      .setMouseInteractions(false);
    synchronizeAxisIntervals(
      chartSpectrogram
        .getDefaultAxisY(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: 8192, stopAxisAfter: false }),
      chartProjectionY
        .getDefaultAxisY(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: 8192, stopAxisAfter: false })
    );
    chartProjectionY
      .getDefaultAxisX()
      .setScrollStrategy(undefined)
      .setMouseInteractions(false);
    chartProjectionY
      .getDefaultAxisX()
      .setTickStrategy((tickStrategy) =>
        tickStrategy
          .setNumericUnits(true)
          .setMajorTickStyle((tickStyle) =>
            tickStyle.setLabelFont((font) => font.setColor(ColorCSS('white')))
          )
      )
      .setTitleFont((fontSettings) => fontSettings.setSize(50))
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setInterval({ start: 0, end: -120, stopAxisAfter: true })
      .setMouseInteractions(false);

    chartProjectionX
      .getDefaultAxisX()
      .setScrollStrategy(undefined)
      .setMouseInteractions(false);
    chartProjectionX
      .getDefaultAxisY()
      .setScrollStrategy(AxisScrollStrategies.progressive)
      .setInterval({ start: -120, end: 0, stopAxisAfter: false })
      .setMouseInteractions(false);
    synchronizeAxisIntervals(
      chartSpectrogram
        .getDefaultAxisX()
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: viewLength, stopAxisAfter: false }),
      chartProjectionX
        .getDefaultAxisX()
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: viewLength, stopAxisAfter: false })
    );
    const chartY = chartProjectionY
      .addLineSeries({
        dataPattern: {
          pattern: 'ProgressiveY',
          regularProgressiveStep: true,
          allowDataGrouping: true,
        },
      })
      .setName('차트 Y')
      .setCursorSolveBasis('nearest-y');
    const chartX = chartProjectionX
      .addLineSeries({
        dataPattern: {
          pattern: 'ProgressiveX',
          regularProgressiveStep: true,
          allowDataGrouping: true,
        },
      })
      .setName('차트 X')
      .setCursorSolveBasis('nearest');

    const theme = Themes.light;

    const lut = new LUT({
      interpolate: true,
      units: 'dB',
      steps: regularColorSteps(-120, -50, theme.examples.intensityColorPalette),
    });
    const surfaceSeries3D = chart3d
      .addSurfaceScrollingGridSeries({
        scrollDimension: 'columns',
        columns: viewLength,
        rows: arrayLength,
      })
      .setWireframeStyle(emptyLine)
      .setFillStyle(
        new PalettedFill({
          lookUpProperty: 'y',
          lut: lut,
        })
      );
    const heatmapSeries = chartSpectrogram
      .addHeatmapScrollingGridSeries({
        scrollDimension: 'columns',
        resolution: 2048,
        heatmapDataType: 'intensity',
      })
      .setFillStyle(
        new PalettedFill({
          lookUpProperty: 'y',
          lut: lut,
        })
      )
      .setWireframeStyle(emptyLine);
    chartRef.current = {
      chartSpectrogram,
      lut,
      chartX,
      chartProjectionX,
      chartY,
      surfaceSeries3D,
      heatmapSeries,
    };
    return () => {
      console.log('destroy chart');
      chartSpectrogram.dispose();
      dash.dispose();
      chartRef.current = undefined;
    };
  }, [id]);

  useEffect(() => {
    const components = chartRef.current;
    if (!components) return;
    const { chartSpectrogram, chartX, chartY, surfaceSeries3D, heatmapSeries } =
      components;
    if (data.length === 0) {
      chartX.clear();
      chartY.clear();
      surfaceSeries3D.clear();
      heatmapSeries.clear();
    }
    if (data.length > 0) {
      const end = data.length < 30 ? data.length : 30;
      chartSpectrogram
        .getDefaultAxisX()
        .setScrollStrategy(AxisScrollStrategies.progressive)
        .setInterval({ start: 0, end: end, stopAxisAfter: false })
        .setTickStrategy(AxisTickStrategies.Numeric);
      heatmapSeries.onMouseClick((t, ev) => {
        try {
          const m = chartSpectrogram.engine.clientLocation2Engine(
            ev.clientX,
            ev.clientY
          );
          const onScale = chartSpectrogram.solveNearest(m).location;
          const yValIndex = Math.round(onScale.x);
          const yVals = data[yValIndex].map((v, i) => {
            return { x: v, y: i };
          });
          chartY.clear().add(yVals);
          const xValIndex = Math.round(onScale.y);
          const xVals = data.map((v, i) => {
            return { x: i, y: v[xValIndex] };
          });
          chartX.clear().add(xVals);
        } catch {}
      });
      const heatSeries = [heatData];
      heatmapSeries.addIntensityValues(heatSeries);
      const yValIndex = data.length - 1;
      const yVals = data[yValIndex].map((v, i) => {
        return { x: v, y: i };
      });
      chartY.clear().add(yVals);

      const xValIndex = data[0].length - 1;

      const xVals = data.map((v, i) => {
        return { x: i, y: v[xValIndex] };
      });
      chartX.clear();
      if (xVals.length > 0) {
        chartX.add(xVals);
      }

      const surfaceData = [data[yValIndex]];
      surfaceSeries3D.addValues({ yValues: surfaceData });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [data, chartRef, viewLength]);
  return (
    <div id={id} ref={chartRef} style={{ width: '100%', height: '96%' }}></div>
  );
}
