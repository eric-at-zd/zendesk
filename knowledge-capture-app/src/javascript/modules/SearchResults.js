import React, { useState } from 'react';
import styled from 'styled-components';
import { Col, Grid, Row } from '@zendeskgarden/react-grid';
import { Well, Title, Paragraph } from '@zendeskgarden/react-notifications';
import { DEFAULT_THEME } from '@zendeskgarden/react-theming';
import { SM } from '@zendeskgarden/react-typography';
import { useGlobalContext } from '../context/Global';
import I18n from '../lib/i18n';
import { displayDateInMDYFormat } from '../lib/utility';
import LinkArticle from './LinkArticle';
import ResultBreadcrumb from './ResultBreadcrumb';

export default function SearchResults({ categories, results, sections }) {
	return (
		<Grid>
			{results.map((result) => (
				<Result
					categories={categories}
					key={result.id}
					result={result}
					sections={sections}
				/>
			))}
		</Grid>
	);
}

function Result({ categories, sections, result }) {
	const { client } = useGlobalContext();

	const [linked, setLinked] = useState(false);

	const section = getSection(result.section_id);
	const category = getCategory(section ? section.category_id : null);

	function getCategory(id) {
		return categories.find((category) => category.id === id);
	}

	function getSection(id) {
		return sections.find((section) => section.id === id);
	}

	function handleClick() {
		client.invoke(
			'ticket.editor.insert',
			`<a href=${result.html_url}?source=search rel="noopener noreferrer" target="_blank" >${result.name}</a>`
		);

		setLinked(true);
	}

	return (
		<Row>
			<Col>
				<Well>
					<ResultTitle title={result.name} />

					<SM>
						{!!category && !!section && (
							<ResultBreadcrumb
								category={category.name}
								section={section.name}
							/>
						)}

						<ModificationInformation date={result.edited_at} />
					</SM>

					<LinkArticle linked={linked} handler={handleClick} />
				</Well>
			</Col>
		</Row>
	);
}

const EditedAt = ({ className, date }) => (
	<Paragraph className={className} size="small">
		{I18n.t('last edited')} {displayDateInMDYFormat(date)}
	</Paragraph>
);

const ModificationInformation = styled(EditedAt)`
	color: ${DEFAULT_THEME.palette.grey[600]};
	margin-top: ${DEFAULT_THEME.space.xxs};
`;

const WellTitle = ({ className, title }) => (
	<Title className={className}>
		<h3>{title}</h3>
	</Title>
);

const ResultTitle = styled(WellTitle)`
	h3 {
		font-size: ${DEFAULT_THEME.lineHeights.sm};
	}
`;
