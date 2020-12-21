export const state = {
    categories: [],
    selectedArticle: {},
    favData: {
        favorite: [],
        purchased: [],
        follow: []
    }
}

export const mutations = {
    setNaviCategory: (state, categories) => {
        state.categories = categories
    },
    setSelectedArticle: (state, article) => {
        state.selectedArticle = article
    },
    markArticleAsFavourite: (state) => (state.selectedArticle.isFavorite = 1 - state.selectedArticle.isFavorite),
    setFavData: function(state, favData) {
        state.favData = favData
    },
    addFavItem: (state, favItem) => {
        if (!state.favData.favorite) {
            return
        }
        let isFavExist = state.favData.favorite.findIndex(
            item => favItem.id == item.id
        )
        if (isFavExist != -1) {
            state.favData.favorite[isFavExist] = favItem
        } else {
            state.favData.favorite.push(favItem)
        }
    },
    removeFavItem: (state, favItem) => {
        if (!state.favData.favorite) {
            return
        }
        let favorite = state.favData.favorite.filter(item => item.id != favItem.id)
        state.favData.favorite = favorite
    },
    addFollowItem: (state, followItem) => {
        if (!state.favData.follow) {
            return
        }
        let isFollowExist = state.favData.follow.findIndex(
            item => followItem.id == item.id
        )
        if (isFollowExist != -1) {
            state.favData.follow[isFollowExist] = followItem
        } else {
            state.favData.follow.push(followItem)
        }
    },
    removeFollowItem: (state, followItem) => {
        if (!state.favData.follow) {
            return
        }
        let follow = state.favData.follow.filter(item => item.id != followItem.id)
        state.favData.follow = follow
    },
}

export const getters = {
    getFavData: state => {
        return state.favData
    },
    naviCategories: state => {
        return state.categories
    },
    selectedArticle: state => state.selectedArticle,
    naviCategoryToObject: state => {
        return state.categories.reduce((ob, val) => {
            ob[val.id] = val
            return ob
        }, {})
    }
}
