import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import GET_TOP_SEARCHES from './queries/topSearchs.graphql';
import styles from './collectionWrapper.css'

class TopSearches extends React.Component {
    renderResult = (result: QueryResult<any, any>) => {

        if (result.loading) return <p>Loading...</p>;
        if (result.error) return <p>Error :</p>;
        const searchTerms = result?.data?.topSearches?.searches?.map((search:any) => `"${search.term}"`).join(', ');

        return (
            <>
                <div className={`${styles.topSearchesContainer}`}>
                    <h2>You can search these too:</h2>
                    <p className={`${styles.topSearchesTerm}`}>{searchTerms}</p>
                </div>
            </>
        );
    }

    render() {
        return (
            <Query query={GET_TOP_SEARCHES}>
                {this.renderResult}
            </Query>
        );
    }
}

export default TopSearches;

