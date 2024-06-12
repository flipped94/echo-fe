<script setup lang="ts">
import { search } from "@/api/search";
import ArticleAbstraction from "@/components/ArticleAbstraction.vue";
import AuthorNode from "@/components/AuthorNode.vue";
import type { ArticleAbstract } from "@/types/article";
import type { Author } from "@/types/author";
import type { Response } from "@/types/axios";
import type { SearchParams } from "@/types/search";
import { NGi, NGrid, NInfiniteScroll, NResult, NTabPane, NTabs } from "naive-ui";
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const noMore = ref(false)

const searchParam = ref<SearchParams>({
    type: route.query.type as string,
    q: route.query.q as string,
    page: 1,
    limit: 20
})

onMounted(() => {
    handleLoad()
})

watch(() => route.query, (newQery, oldQuery) => {
    searchParam.value.q = newQery.q as string
    searchParam.value.type = newQery.type as string
    searchParam.value.page = 1
    searchParam.value.limit = 20
    artiles.value = []
    handleLoad()
})


const artiles = ref<ArticleAbstract[]>([])
const authors = ref<Author[]>([])

const handleLoad = async () => {
    if (loading.value || noMore.value) {
        return
    }
    loading.value = true
    search(searchParam.value).then((res: Response<any[]>) => {
        if (res.code === '200') {
            if (searchParam.value.type === 'article') {
                const s: string = JSON.stringify(res.data)
                const articleList: ArticleAbstract[] = JSON.parse(s)
                artiles.value.push(...articleList)
                searchParam.value.page++
            }
            if (searchParam.value.type === 'author') {
                const s: string = JSON.stringify(res.data)
                const authorList: Author[] = JSON.parse(s)
                authors.value.push(...authorList)
                searchParam.value.page++
            }
        }
    })
    loading.value = false
}

function handleChange(value: string) {
    searchParam.value.type = value
    searchParam.value.limit = 20
    searchParam.value.page = 1
    artiles.value = []
    authors.value = []
    router.push({
        name: 'search',
        query: {
            q: searchParam.value.q,
            type: searchParam.value.type,
            _t: Date.now(),
        }
    })
}
</script>
<template>
    <div class="search-result-wrapper">
        <NTabs tab-class="search-tab" animated justify-content="center"
            :value="searchParam.type" type="card" size="large"
            :on-update:value="handleChange">
            <NTabPane name="article" tab="文章">
                <NInfiniteScroll :distance="10" @load="handleLoad">
                    <NGrid :x-gap="20" :y-gap="20" :cols="1">
                        <NGi v-for="item in artiles" :key="item.id">
                            <ArticleAbstraction :article="item"
                                @like="() => { }" @collect="() => { }">
                            </ArticleAbstraction>
                        </NGi>
                    </NGrid>
                    <NResult v-if="noMore" status="500" size="small"
                        description="到底了" class="no-more">
                    </NResult>
                </NInfiniteScroll>

            </NTabPane>
            <NTabPane name="author" tab="用户">
                <NInfiniteScroll :distance="10" @load="handleLoad">
                    <NGrid :x-gap="20" :y-gap="20" :cols="1">
                        <NGi v-for="item in authors" :key="item.id">
                            <AuthorNode :author="item">
                            </AuthorNode>
                        </NGi>
                    </NGrid>
                    <NResult v-if="noMore" status="500" size="small"
                        description="到底了" class="no-more">
                    </NResult>
                </NInfiniteScroll>

            </NTabPane>
        </NTabs>
    </div>
</template>
<style scoped>
.search-result-wrapper {
    background: #f2f4f6;
    margin-top: 1%;
    margin-left: 15%;
    margin-right: 15%;
}

.search-tab {
    background: #ffffff;
}
</style>