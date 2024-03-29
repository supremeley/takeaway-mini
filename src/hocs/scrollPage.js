// import { Component } from 'react'

export default function withScrollPage(WrappedComponent) {
  return class ScrollPageComponent extends WrappedComponent {
    // constructor(...props) {
    //   super(...props)
    //   const { pageSize = 10, offset = 0 } = props || {}

    //   const page = {
    //     hasNext: true,
    //     isLoading: false,
    //     offset: offset,
    //     page_size: pageSize
    //   }

    //   this.state.page = page
    // }

    state = {
      ...this.state,
      pageParams: {
        limit: 10,
        page: 1,
        hasNext: true,
        isLoading: false,
        total: 0
      }
    }

    nextPage = async () => {
      const { pageParams } = this.state

      if (!pageParams.hasNext || pageParams.isLoading) return

      pageParams.isLoading = true

      this.setState({
        pageParams
      })

      const { limit, page } = pageParams

      const { total } = await this.fetch({ limit, page })

      if (!total || total < (limit * page)) {
        pageParams.hasNext = false
      }

      const nextPageParams = {
        ...pageParams,
        page: pageParams.page + 1,
        isLoading: false,
        total
      }

      this.setState({
        pageParams: nextPageParams
      })
    }

    resetPage(cb = () => { }) {
      const { pageParams } = this.state

      const resetPageParams = {
        ...(pageParams || {}),
        page: 1,
        limit: 10,
        isLoading: false,
        hasNext: true
      }

      this.setState({ pageParams: resetPageParams }, cb)
    }

    // render() {
    //   const newProps = {
    //     ...this.state,
    //     nextPage: () => this.nextPage,
    //     resetPage: () => this.resetPage
    //   }

    //   return <WrappedComponent {...this.state} />
    // }
  }
}
