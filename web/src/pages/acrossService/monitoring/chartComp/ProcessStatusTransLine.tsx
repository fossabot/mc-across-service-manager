import { useGetProStatusTransByIns } from '@apis/useMonitoringAcrossService';
import dayjs from 'dayjs';
import { SeriesOption } from 'echarts';
import { useEffect, useState } from 'react';
import MainCard from '@/components/cards/MainCard';
import LineChart from '@/components/charts/LineChartComp';

interface Props {
  instanceName: string;
}

export default function ProcessTransitionChart({ instanceName }: Props) {
  const processStatusTransition = useGetProStatusTransByIns(instanceName);

  const [series, setSeries] = useState<SeriesOption[]>([]);
  const [x, setX] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    function getSeries(): SeriesOption[] | undefined {
      if (processStatusTransition.isSuccess) {
        const fieldList = new Map();
        for (const item of processStatusTransition.data) {
          fieldList.set(item['_field'], item['_field']);
        }
        const datas = processStatusTransition.data.reduce<{ [key: string]: number[] }>((acc, item) => {
          const field = item['_field'];
          if (!acc[field]) {
            acc[field] = [];
          }
          if (typeof item._value === 'number') {
            acc[field].push(item._value);
          }
          return acc;
        }, {});

        const seriesData = Object.keys(datas).map(dataKey => ({
          name: dataKey,
          data: datas[dataKey],
          type: 'line',
        }));
        return seriesData as SeriesOption[];

        // Add a type guard to check the value of the `type` property.
        // return seriesData.filter(item => item.type === 'line') as SeriesOption[];
      }
    }

    function getXAxis() {
      if (processStatusTransition.isSuccess) {
        const timeValues = processStatusTransition.data.reduce<string[]>((acc, item) => {
          acc.push(dayjs(item._time).format('YYYY-MM-DD HH:mm:ss'));
          return acc;
        }, []);
        // 중복 제거
        const uniqueTimeValues = new Set(timeValues);
        return [...uniqueTimeValues];
      }
    }
    const data = getSeries();
    const data2 = getXAxis();
    data ? setSeries(data) : null;
    data2 ? setX(data2) : null;
    setLoading(false);
  }, [processStatusTransition.data, processStatusTransition.isSuccess]);

  if (series.length === 0) {
    return (
      <MainCard title="프로세스 상태별 추이 - 1h" content={true}>
        <div>데이터가 없습니다.</div>
      </MainCard>
    );
  }

  return (
    <MainCard title="프로세스 상태별 추이 - 1h" content={true}>
      <LineChart loading={loading} xAxis={x} series={series} />
    </MainCard>
  );
}
