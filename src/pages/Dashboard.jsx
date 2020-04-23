
import * as React from 'react';

import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { DateRangePicker } from '@progress/kendo-react-dateinputs';

import { firstDayOfMonth, lastDayOfMonth } from '@progress/kendo-date-math';
import { useLocalization } from '@progress/kendo-react-intl';
import { filterBy } from '@progress/kendo-data-query';

import { Grid, Column, ColumnMenu } from './../components/Grid';
import { Chart } from './../components/Chart';
import { FullNameCell, FlagCell, OnlineCell, RatingCell, EngagementCell, CurrencyCell } from './../components/GridCells';

import { AppContext } from './../AppContext'

import { employees } from './../resources/employees';
import { teams } from './../resources/teams';
import { orders } from './../resources/orders';

const Dashboard = () => {
    const [data, setData] = React.useState(employees);
    const [isTrend, setIsTrend] = React.useState(true);
    const [isMyTeam, setIsMyTeam] = React.useState(true);
    const localizationService = useLocalization();
    const toLanguageString = localizationService.toLanguageString;

    const { teamId } = React.useContext(AppContext);
    const gridFilterExpression = isMyTeam ? {
            logic: "and",
            filters: [{ field: "teamId", operator: "eq", value: teamId }]
        } : null;

    const [range, setRange] = React.useState({
        start: new Date('2018-07-01T21:00:00.000Z'),
        end: new Date('2018-09-30T21:00:00.000Z')
    });

    const onRangeChange = React.useCallback(
        (event) => {
            let rangeStart;
            let rangeEnd;

            if (event.value.start) {
                rangeStart = firstDayOfMonth(event.value.start)
            }
            if (event.value.end) {
                rangeEnd = lastDayOfMonth(event.value.end)
            }

            setRange({
                start: rangeStart,
                end: rangeEnd
            })
        },
        [setRange]
    );
    const trendOnClick = React.useCallback(
        () => setIsTrend(true),
        [setIsTrend]
    );
    const volumeOnClick = React.useCallback(
        () => setIsTrend(false),
        [setIsTrend]
    );
    const myTeamOnClick = React.useCallback(
        () => setIsMyTeam(true),
        [setIsMyTeam]
    );
    const allTeamOnClick = React.useCallback(
        () => setIsMyTeam(false),
        [setIsMyTeam]
    );

    return (
        <div id="Dashboard" className="dashboard-page main-content">
            <div className="card-container grid">
                <h3 className="card-title">{toLanguageString('custom.teamEfficiency')}</h3>
                <div className="card-buttons">
                    <ButtonGroup>
                        <Button togglable={true} selected={isTrend} onClick={trendOnClick}>
                            {toLanguageString('custom.trend')}
                        </Button>
                        <Button togglable={true} selected={!isTrend} onClick={volumeOnClick}>
                            {toLanguageString('custom.volume')}
                        </Button>
                    </ButtonGroup>
                </div>
                <div className="card-ranges">
                    <DateRangePicker value={range} onChange={onRangeChange} />
                </div>
                <div className="card-component">
                    <Chart
                        data={orders}
                        filterStart={range.start}
                        filterEnd={range.end}
                        groupByField={'teamID'}
                        groupResourceData={teams}
                        groupTextField={'teamName'}
                        groupColorField={'teamColor'}
                        seriesCategoryField={'orderDate'}
                        seriesField={'orderTotal'}
                        seriesType={isTrend ? 'line' : 'column'}
                    />
                </div>
            </div>
            <div className="card-container grid">
                <h3 className="card-title">{toLanguageString('custom.teamMembers')}</h3>
                <div className="card-buttons">
                    <ButtonGroup>
                        <Button togglable={true} selected={isMyTeam} onClick={myTeamOnClick}>
                            {toLanguageString('custom.myTeam')}
                        </Button>
                        <Button togglable={true} selected={!isMyTeam} onClick={allTeamOnClick}>
                            {toLanguageString('custom.allTeams')}
                        </Button>
                    </ButtonGroup>
                </div>
                <span></span>
                <div className="card-component">
                    <Grid data={filterBy(data, gridFilterExpression)} style={{ height: 480, maxWidth: window.innerWidth - 20, margin: '0 auto' }} onDataChange={data => setData(data)}>
                        <Column title={toLanguageString('custom.employee')}>
                            <Column field={'fullName'} title={toLanguageString('custom.contactName')} columnMenu={ColumnMenu} width={230} cell={FullNameCell} />
                            <Column field={'jobTitle'} title={toLanguageString('custom.jobTitle')} columnMenu={ColumnMenu} width={230} />
                            <Column field={'country'} title={toLanguageString('custom.country')} columnMenu={ColumnMenu} width={100} cell={FlagCell} />
                            <Column field={'isOnline'} title={toLanguageString('custom.status')} columnMenu={ColumnMenu} width={100} cell={OnlineCell} />
                        </Column>
                        <Column title={toLanguageString('custom.performance')}>
                            <Column field={'rating'} title={toLanguageString('custom.rating')} columnMenu={ColumnMenu} width={110} cell={RatingCell} />
                            <Column field={'target'} title={toLanguageString('custom.engagement')} columnMenu={ColumnMenu} width={200} cell={EngagementCell} />
                            <Column field={'budget'} title={toLanguageString('custom.budget')} columnMenu={ColumnMenu} width={100} cell={CurrencyCell} />
                        </Column>
                        <Column title={toLanguageString('custom.contacts')}>
                            <Column field={'phone'} title={toLanguageString('custom.phone')} columnMenu={ColumnMenu} width={130} />
                            <Column field={'address'} title={toLanguageString('custom.address')} columnMenu={ColumnMenu} width={200} />
                        </Column>
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

