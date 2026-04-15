import Tasks from './ui/Tasks';
import { Col, Row } from 'antd';
import Habits from './ui/Habits';
import Finance from './ui/Finance';
import Progress from './ui/Progress';
import Projects from './ui/Projects';
import Statistics from './ui/Statistics';
import FastActions from './ui/FastActions';
import type { Route } from '../+types/home';
import content from '@/pages/dashboard/content';

// const { Title, Text } = Typography;

// export async function loader({ params }: Route.LoaderArgs) {
//   // console.log('🔵 Loader (server)');
//   const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
//   const post = await res.json();
//   return { serverPost: post };
// }

// export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
//   // console.log('🟢 ClientLoader (browser)');

//   const serverData = await serverLoader();

//   const res = await fetch('https://jsonplaceholder.typicode.com/posts');
//   const allPosts = await res.json();

//   return {
//     ...serverData,
//     allPosts,
//   };
// }

// 👇 ЭТО РЕШАЕТ ПРОБЛЕМУ
// clientLoader.hydrate = true;

// 👇 Обязательный компонент для отображения во время загрузки
// export function HydrateFallback() {
//   return (
//     <div style={{ padding: 24 }}>
//       <h1>PrimeLifeTracker</h1>
//       <div>Загрузка данных...</div>
//     </div>
//   );
// }

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { progress, statistics, fastActions, tasks, projects, habits, finance } = content;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Progress {...progress} />
        </Col>
        <Col span={8}>
          <Statistics {...statistics} />
        </Col>
        <Col span={8}>
          <FastActions {...fastActions} />
        </Col>

        <Col span={12}>
          <Tasks {...tasks} />
        </Col>
        <Col span={12}>
          <Projects {...projects} />
        </Col>

        <Col span={8}>
          <Habits {...habits} />
        </Col>
        <Col span={16}>
          <Finance {...finance} />
        </Col>
      </Row>
    </>
  );
}
