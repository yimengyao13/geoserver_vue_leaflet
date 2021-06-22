import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MapStart from '@/views/MapStart'
import MapWMTS from '@/views/MapWMTS'
import ClickFeature from '@/views/ClickFeature'
import FeatureCQL from '@/views/FeatureCQL'
import MapDraw from '@/views/MapDraw'
import PostGML from '@/views/PostGML'
import PointDraw from '@/views/PointDraw'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/mapstart',
      name: 'MapStart',
      component: MapStart
    },
    {
      path: '/mapwmts',
      name: 'MapWMTS',
      component: MapWMTS
    },
    {
      path: '/clickfeature',
      name: 'ClickFeature',
      component: ClickFeature
    },
    {
      path: '/featurecql',
      name: 'FeatureCQL',
      component: FeatureCQL
    },
    {
      path: '/mapdraw',
      name: 'MapDraw',
      component: MapDraw
    },
    {
      path: '/postgml',
      name: 'PostGML',
      component: PostGML
    },
    {
      path: '/pointdraw',
      name: 'PointDraw',
      component: PointDraw
    }
  ]
})
